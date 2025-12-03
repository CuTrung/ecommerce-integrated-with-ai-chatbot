import { Injectable } from '@nestjs/common';
import { CreateCartDto, ImportCartsDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ExportCartsDto, GetCartsPaginationDto } from './dto/get-cart.dto';
import { PrismaBaseService } from '../../common/services/prisma-base.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ExcelUtilService } from '../../common/utils/excel-util/excel-util.service';
import { Cart } from './entities/cart.entity';
import { Prisma } from '@prisma/client';
import {
  GetOptionsParams,
  Options,
} from '../../common/query/options.interface';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';
import { QueryUtilService } from '../../common/utils/query-util/query-util.service';

@Injectable()
export class CartsService extends PrismaBaseService<'cart'> implements Options {
  private cartEntityName = Cart.name;
  private excelSheets = {
    [this.cartEntityName]: this.cartEntityName,
  };
  constructor(
    private excelUtilService: ExcelUtilService,
    public prismaService: PrismaService,
    private paginationUtilService: PaginationUtilService,
    private queryUtilService: QueryUtilService,
  ) {
    super(prismaService, 'cart');
  }

  get client() {
    return super.client;
  }

  get extended() {
    return super.extended;
  }

  async getCart(where: Prisma.CartWhereUniqueInput) {
    const data = await this.extended.findUnique({
      where,
    });
    return data;
  }

  async getCarts({ page, itemPerPage }: GetCartsPaginationDto) {
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

  async createCart(createCartDto: CreateCartDto) {
    const data = await this.extended.create({
      data: createCartDto,
    });
    return data;
  }

  async updateCart(params: {
    where: Prisma.CartWhereUniqueInput;
    data: UpdateCartDto;
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
      this.queryUtilService.convertFieldsSelectOption<Cart>(select);
    const data = await this.extended.findMany({
      select: fieldsSelect,
      where: {
        ...searchFields,
      },
      take: Number(limit),
    });
    return data;
  }

  async exportCarts({ ids, select }: ExportCartsDto) {
    const where: Record<string, any> = {};
    if (ids) {
      where.id = { in: ids };
    }
    const fieldsSelect =
      this.queryUtilService.convertFieldsSelectOption<Cart>(select);
    const carts = await this.extended.export({
      select: fieldsSelect,
      where,
    });

    const data = this.excelUtilService.generateExcel({
      worksheets: [
        {
          sheetName: this.excelSheets[this.cartEntityName],
          data: carts,
        },
      ],
    });

    return data;
  }

  async importCarts({ file, user }: ImportCartsDto) {
    const cartSheetName = this.excelSheets[this.cartEntityName];
    const dataCreated = await this.excelUtilService.read(file);
    const data = await this.extended.createMany({
      data: dataCreated[cartSheetName].map((item) => ({
        ...item,
        user,
      })),
    });
    return data;
  }

  async deleteCart(where: Prisma.CartWhereUniqueInput) {
    const data = await this.extended.softDelete(where);
    return data;
  }
}
