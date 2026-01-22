import { Injectable } from '@nestjs/common';
import {
  CreateOrderItemDto,
  ImportOrderItemsDto,
} from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import {
  ExportOrderItemsDto,
  GetOrderItemsPaginationDto,
} from './dto/get-order-item.dto';
import { PrismaBaseService } from '../../common/services/prisma-base.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ExcelUtilService } from '../../common/utils/excel-util/excel-util.service';
import { OrderItem } from './entities/order-item.entity';
import { Prisma } from '@prisma/client';
import {
  GetOptionsParams,
  Options,
} from '../../common/query/options.interface';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';
import { QueryUtilService } from '../../common/utils/query-util/query-util.service';
import { WithUser } from '../../common/decorators/user.decorator';

@Injectable()
export class OrderItemsService
  extends PrismaBaseService<'orderItem'>
  implements Options
{
  private orderItemEntityName = OrderItem.name;
  private excelSheets = {
    [this.orderItemEntityName]: this.orderItemEntityName,
  };
  constructor(
    private excelUtilService: ExcelUtilService,
    public prismaService: PrismaService,
    private paginationUtilService: PaginationUtilService,
    private queryUtilService: QueryUtilService,
  ) {
    super(prismaService, 'orderItem');
  }

  get client() {
    return super.client;
  }

  get extended() {
    return super.extended;
  }

  async getOrderItem(where: Prisma.OrderItemWhereUniqueInput) {
    const data = await this.extended.findUnique({
      where,
    });
    return data;
  }

  async getOrderItems({
    page,
    itemPerPage,
    select,
    ...search
  }: GetOrderItemsPaginationDto) {
    const totalItems = await this.extended.count();
    const paging = this.paginationUtilService.paging({
      page,
      itemPerPage,
      totalItems,
    });
    const fieldsSelect =
      this.queryUtilService.convertFieldsSelectOption<OrderItem>(select);
    const searchQuery = this.queryUtilService.buildSearchQuery<OrderItem>({
      search,
    });
    const list = await this.extended.findMany({
      select: fieldsSelect,
      skip: paging.skip,
      take: paging.itemPerPage,
      where: searchQuery,
      include: {
        productVariant: {
          include: {
            product: true,
          },
        },
      },
    });

    const data = paging.format(list);
    return data;
  }

  async createOrderItem(createOrderItemDto: WithUser<CreateOrderItemDto>) {
    const data = await this.extended.create({
      data: createOrderItemDto,
    });
    return data;
  }

  async updateOrderItem(params: {
    where: Prisma.OrderItemWhereUniqueInput;
    data: UpdateOrderItemDto;
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
      this.queryUtilService.convertFieldsSelectOption<
        Omit<OrderItem, 'productVariantSnapshot'>
      >(select);
    const searchQuery = this.queryUtilService.buildSearchQuery<
      Omit<OrderItem, 'productVariantSnapshot'>
    >({
      search,
    });
    const data = await this.extended.findMany({
      select: fieldsSelect,
      take: limit,
      where: searchQuery,
    });
    return data;
  }

  async exportOrderItems({ ids, select }: ExportOrderItemsDto) {
    const where: Record<string, any> = {};
    if (ids) {
      where.id = { in: ids };
    }
    const fieldsSelect =
      this.queryUtilService.convertFieldsSelectOption<OrderItem>(select);
    const orderItems = await this.extended.export({
      select: fieldsSelect,
      where,
    });

    const data = this.excelUtilService.generateExcel({
      worksheets: [
        {
          sheetName: this.excelSheets[this.orderItemEntityName],
          data: orderItems,
        },
      ],
    });

    return data;
  }

  async importOrderItems({ file, user }: ImportOrderItemsDto) {
    const orderItemSheetName = this.excelSheets[this.orderItemEntityName];
    const dataCreated = await this.excelUtilService.read(file);
    const data = await this.extended.createMany({
      data: dataCreated[orderItemSheetName].map((item) => ({
        ...item,
        user,
      })),
    });
    return data;
  }

  async deleteOrderItem(where: Prisma.OrderItemWhereUniqueInput) {
    const data = await this.extended.softDelete(where);
    return data;
  }
}
