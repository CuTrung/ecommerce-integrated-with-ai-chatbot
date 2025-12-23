import { Injectable, Logger } from '@nestjs/common';
import { CreateOrderDto, ImportOrdersDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ExportOrdersDto, GetOrdersPaginationDto } from './dto/get-order.dto';
import { PrismaBaseService } from '../../common/services/prisma-base.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ExcelUtilService } from '../../common/utils/excel-util/excel-util.service';
import { Order } from './entities/order.entity';
import { OrderStatus, Prisma } from '@prisma/client';
import {
  GetOptionsParams,
  Options,
} from '../../common/query/options.interface';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';
import { QueryUtilService } from '../../common/utils/query-util/query-util.service';
import { WithUser } from '../../common/decorators/user.decorator';
import { PaymentsService } from '../payments/payments.service';
import { PaymentsModule } from '../payments/payments.module';
import { LazyModuleLoader } from '@nestjs/core';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { OrderEvents } from './events/order.event';
import { NotificationsService } from '../notifications/notifications.service';
import { EventsGateway } from '../../events/events.gateway';
import { NotificationsModule } from '../notifications/notifications.module';

@Injectable()
export class OrdersService
  extends PrismaBaseService<'order'>
  implements Options
{
  private orderEntityName = Order.name;
  private excelSheets = {
    [this.orderEntityName]: this.orderEntityName,
  };
  private notificationsService: NotificationsService;
  constructor(
    private excelUtilService: ExcelUtilService,
    public prismaService: PrismaService,
    private paginationUtilService: PaginationUtilService,
    private queryUtilService: QueryUtilService,
    private readonly lazyModuleLoader: LazyModuleLoader,
    private eventEmitter: EventEmitter2,
    private readonly eventsGateway: EventsGateway,
  ) {
    super(prismaService, 'order');
  }

  get client() {
    return super.client;
  }

  get extended() {
    return super.extended;
  }

  async getPaymentsService() {
    const paymentsModule = await this.lazyModuleLoader.load(
      () => PaymentsModule,
    );
    const paymentsService = paymentsModule.get(PaymentsService);
    return paymentsService;
  }

  async getNotificationsService() {
    if (this.notificationsService) return this.notificationsService;
    const notificationsModule = await this.lazyModuleLoader.load(
      () => NotificationsModule,
    );
    const notificationsService = notificationsModule.get(NotificationsService);
    this.notificationsService = notificationsService;
    return notificationsService;
  }

  async getOrder(where: Prisma.OrderWhereUniqueInput) {
    const data = await this.extended.findUnique({
      where,
    });
    return data;
  }

  async getOrders({
    page,
    itemPerPage,
    select,
    ...search
  }: GetOrdersPaginationDto) {
    const totalItems = await this.extended.count();
    const paging = this.paginationUtilService.paging({
      page,
      itemPerPage,
      totalItems,
    });
    const fieldsSelect =
      this.queryUtilService.convertFieldsSelectOption<Order>(select);
    const searchQuery = this.queryUtilService.buildSearchQuery<Order>({
      search,
    });
    const list = await this.extended.findMany({
      select: fieldsSelect,
      skip: paging.skip,
      take: paging.itemPerPage,
      where: searchQuery,
    });

    const data = paging.format(list);
    return data;
  }

  async createOrder(createOrderDto: WithUser<CreateOrderDto>) {
    const orderCreated = await this.extended.create({
      data: createOrderDto,
    });

    const { orderNumber, totalAmount, id: orderID } = orderCreated;
    const paymentsService = await this.getPaymentsService();
    const payment = await paymentsService.createPayment({
      orderNumber,
      totalAmount,
      user: createOrderDto.user,
      orderID,
    });
    const data = { ...orderCreated, paymentUrl: payment.paymentUrl };
    // this.eventEmitter.emit(OrderEvents.CREATED, {
    //   ...data,
    //   user: createOrderDto.user,
    // });
    return data;
  }

  async updateOrder(params: {
    where: Prisma.OrderWhereUniqueInput;
    data: UpdateOrderDto;
  }) {
    const { where, data: dataUpdate } = params;
    const data = await this.extended.update({
      data: dataUpdate,
      where,
    });
    return data;
  }

  async getOptions(params: GetOptionsParams) {
    const { limit, select, ...search } = params;
    const fieldsSelect =
      this.queryUtilService.convertFieldsSelectOption<Order>(select);
    const searchQuery = this.queryUtilService.buildSearchQuery<Order>({
      search,
    });
    const data = await this.extended.findMany({
      select: fieldsSelect,
      take: limit,
      where: searchQuery,
    });
    return data;
  }

  async exportOrders({ ids, select }: ExportOrdersDto) {
    const where: Record<string, any> = {};
    if (ids) {
      where.id = { in: ids };
    }
    const fieldsSelect =
      this.queryUtilService.convertFieldsSelectOption<Order>(select);
    const orders = await this.extended.export({
      select: fieldsSelect,
      where,
    });

    const data = this.excelUtilService.generateExcel({
      worksheets: [
        {
          sheetName: this.excelSheets[this.orderEntityName],
          data: orders,
        },
      ],
    });

    return data;
  }

  async importOrders({ file, user }: ImportOrdersDto) {
    const orderSheetName = this.excelSheets[this.orderEntityName];
    const dataCreated = await this.excelUtilService.read(file);
    const data = await this.extended.createMany({
      data: dataCreated[orderSheetName].map((item) => ({
        ...item,
        user,
      })),
    });
    return data;
  }

  async deleteOrder(where: Prisma.OrderWhereUniqueInput) {
    const data = await this.extended.softDelete(where);
    return data;
  }

  // @Cron(CronExpression.EVERY_MINUTE)
  async cancelOrderBackground() {
    const timeExpired = new Date(Date.now() - 10 * 60 * 1000); // >= 10 minutes

    const orders = await this.extended.findMany({
      where: {
        status: OrderStatus.pending,
        createdAt: { lt: timeExpired },
      },
    });

    const totalOrders = orders.length;
    if (totalOrders === 0) return;

    const ids = orders.map((o) => o.id);
    await this.extended.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        status: OrderStatus.canceled,
      },
    });

    const notificationsService = await this.getNotificationsService();
    const notificationsCanceled = orders.map((order) => ({
      userID: order.userID,
      title: `Order canceled by system`,
      message: `Your order ${order.orderNumber} has been canceled due to non-payment within the required time frame.`,
    }));
    await notificationsService.extended.createMany({
      data: notificationsCanceled,
    });

    // this.eventsGateway.emitEvent(OrderEvents.CANCELED, { message });
    Logger.log({
      context: OrdersService.name,
      message: `Canceled ${totalOrders} orders: ${JSON.stringify(ids)}`,
    });
  }

  @OnEvent(OrderEvents.CREATED)
  async orderCreated(payload) {
    const { user, orderNumber } = payload;
    const message = `Your order ${orderNumber} has been created successfully.`;
    const notificationsService = await this.getNotificationsService();
    await notificationsService.createNotification({
      user,
      title: `Order ${orderNumber} Created`,
      message,
    });

    // this.eventsGateway.emitEvent(OrderEvents.CREATED, { message });
  }
}
