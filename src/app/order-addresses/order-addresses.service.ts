import { Injectable } from '@nestjs/common';
import {
  CreateOrderAddressDto,
  ImportOrderAddressesDto,
} from './dto/create-order-address.dto';
import { UpdateOrderAddressDto } from './dto/update-order-address.dto';
import {
  ExportOrderAddressesDto,
  GetOrderAddressesPaginationDto,
} from './dto/get-order-address.dto';
import { PrismaBaseService } from '../../common/services/prisma-base.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ExcelUtilService } from '../../common/utils/excel-util/excel-util.service';
import { OrderAddress } from './entities/order-address.entity';
import { Prisma } from '@prisma/client';
import {
  GetOptionsParams,
  Options,
} from '../../common/query/options.interface';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';
import { QueryUtilService } from '../../common/utils/query-util/query-util.service';
import { WithUser } from '../../common/decorators/user.decorator';

@Injectable()
export class OrderAddressesService
  extends PrismaBaseService<'orderAddress'>
  implements Options
{
  private orderAddressEntityName = OrderAddress.name;
  private excelSheets = {
    [this.orderAddressEntityName]: this.orderAddressEntityName,
  };
  constructor(
    private excelUtilService: ExcelUtilService,
    public prismaService: PrismaService,
    private paginationUtilService: PaginationUtilService,
    private queryUtilService: QueryUtilService,
  ) {
    super(prismaService, 'orderAddress');
  }

  get client() {
    return super.client;
  }

  get extended() {
    return super.extended;
  }

  async getOrderAddress(where: Prisma.OrderAddressWhereUniqueInput) {
    const data = await this.extended.findUnique({
      where,
    });
    return data;
  }

  async getOrderAddresses({
    page,
    itemPerPage,
    select,
  }: GetOrderAddressesPaginationDto) {
    const totalItems = await this.extended.count();
    const paging = this.paginationUtilService.paging({
      page,
      itemPerPage,
      totalItems,
    });
    const fieldsSelect =
      this.queryUtilService.convertFieldsSelectOption<OrderAddress>(select);
    const list = await this.extended.findMany({
      select: fieldsSelect,
      skip: paging.skip,
      take: paging.itemPerPage,
    });

    const data = paging.format(list);
    return data;
  }

  async createOrderAddress(
    createOrderAddressDto: WithUser<CreateOrderAddressDto>,
  ) {
    const data = await this.extended.create({
      data: createOrderAddressDto,
    });
    return data;
  }

  async updateOrderAddress(params: {
    where: Prisma.OrderAddressWhereUniqueInput;
    data: UpdateOrderAddressDto;
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
      this.queryUtilService.convertFieldsSelectOption<OrderAddress>(select);
    const data = await this.extended.findMany({
      select: fieldsSelect,
      where: {
        ...searchFields,
      },
      take: limit,
    });
    return data;
  }

  async exportOrderAddresses({ ids, select }: ExportOrderAddressesDto) {
    const where: Record<string, any> = {};
    if (ids) {
      where.id = { in: ids };
    }
    const fieldsSelect =
      this.queryUtilService.convertFieldsSelectOption<OrderAddress>(select);
    const orderAddresses = await this.extended.export({
      select: fieldsSelect,
      where,
    });

    const data = this.excelUtilService.generateExcel({
      worksheets: [
        {
          sheetName: this.excelSheets[this.orderAddressEntityName],
          data: orderAddresses,
        },
      ],
    });

    return data;
  }

  async importOrderAddresses({ file, user }: ImportOrderAddressesDto) {
    const orderAddressSheetName = this.excelSheets[this.orderAddressEntityName];
    const dataCreated = await this.excelUtilService.read(file);
    const data = await this.extended.createMany({
      data: dataCreated[orderAddressSheetName].map((item) => ({
        ...item,
        user,
      })),
    });
    return data;
  }

  async deleteOrderAddress(where: Prisma.OrderAddressWhereUniqueInput) {
    const data = await this.extended.softDelete(where);
    return data;
  }
}
