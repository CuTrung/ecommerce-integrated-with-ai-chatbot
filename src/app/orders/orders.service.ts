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

@Injectable()
export class OrdersService
  extends PrismaBaseService<'order'>
  implements Options
{
  private orderEntityName = Order.name;
  private excelSheets = {
    [this.orderEntityName]: this.orderEntityName,
  };
  constructor(
    private excelUtilService: ExcelUtilService,
    public prismaService: PrismaService,
    private paginationUtilService: PaginationUtilService,
    private queryUtilService: QueryUtilService,
  ) {
    super(prismaService, 'order');
  }

  get client() {
    return super.client;
  }

  get extended() {
    return super.extended;
  }

  async getOrder(where: Prisma.OrderWhereUniqueInput) {
    const data = await this.extended.findUnique({
      where,
    });
    return data;
  }

  async getOrders({ page, itemPerPage }: GetOrdersPaginationDto) {
    const totalItems = await this.extended.count();
    const paging = this.paginationUtilService.paging({
      page,
      itemPerPage,
      totalItems,
    });
    const list = await this.extended.findMany({
      skip: paging.skip,
      take: itemPerPage,
    });

    const data = paging.format(list);
    return data;
  }

  async createOrder(createOrderDto: WithUser<CreateOrderDto>) {
    const data = await this.extended.create({
      data: createOrderDto,
    });
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
    const { limit, select, ...searchFields } = params;
    const fieldsSelect =
      this.queryUtilService.convertFieldsSelectOption<Order>(select);
    const data = await this.extended.findMany({
      select: fieldsSelect,
      where: {
        ...searchFields,
      },
      take: Number(limit),
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
        status: OrderStatus.cancelled,
      },
    });

    Logger.log({
      context: OrdersService.name,
      message: `Canceled ${totalOrders} orders: ${JSON.stringify(ids)}`,
    });
  }
}
