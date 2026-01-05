import { Injectable } from '@nestjs/common';
import {
  CreateCartItemDto,
  ImportCartItemsDto,
} from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import {
  ExportCartItemsDto,
  GetCartItemsPaginationDto,
} from './dto/get-cart-item.dto';
import { PrismaBaseService } from '../../common/services/prisma-base.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ExcelUtilService } from '../../common/utils/excel-util/excel-util.service';
import { CartItem } from './entities/cart-item.entity';
import { Prisma } from '@prisma/client';
import {
  GetOptionsParams,
  Options,
} from '../../common/query/options.interface';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';
import { QueryUtilService } from '../../common/utils/query-util/query-util.service';
import { WithUser } from '../../common/decorators/user.decorator';

@Injectable()
export class CartItemsService
  extends PrismaBaseService<'cartItem'>
  implements Options
{
  private cartItemEntityName = CartItem.name;
  private excelSheets = {
    [this.cartItemEntityName]: this.cartItemEntityName,
  };
  constructor(
    private excelUtilService: ExcelUtilService,
    public prismaService: PrismaService,
    private paginationUtilService: PaginationUtilService,
    private queryUtilService: QueryUtilService,
  ) {
    super(prismaService, 'cartItem');
  }

  get client() {
    return super.client;
  }

  get extended() {
    return super.extended;
  }

  async getCartItem(where: Prisma.CartItemWhereUniqueInput) {
    const data = await this.extended.findUnique({
      where,
    });
    return data;
  }

  async getCartItems({
    page,
    itemPerPage,
    select,
    ...search
  }: GetCartItemsPaginationDto) {
    const totalItems = await this.extended.count();
    const paging = this.paginationUtilService.paging({
      page,
      itemPerPage,
      totalItems,
    });
    const fieldsSelect =
      this.queryUtilService.convertFieldsSelectOption<CartItem>(select);
    const searchQuery = this.queryUtilService.buildSearchQuery<CartItem>({
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

  async createCartItem(createCartItemDto: WithUser<CreateCartItemDto>) {
    const data = await this.extended.create({
      data: createCartItemDto,
    });
    return data;
  }

  async updateCartItem(params: {
    where: Prisma.CartItemWhereUniqueInput;
    data: UpdateCartItemDto;
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
      this.queryUtilService.convertFieldsSelectOption<CartItem>(select);
    const searchQuery = this.queryUtilService.buildSearchQuery<CartItem>({
      search,
    });
    const data = await this.extended.findMany({
      select: fieldsSelect,
      take: limit,
      where: searchQuery,
    });
    return data;
  }

  async exportCartItems({ ids, select }: ExportCartItemsDto) {
    const where: Record<string, any> = {};
    if (ids) {
      where.id = { in: ids };
    }
    const fieldsSelect =
      this.queryUtilService.convertFieldsSelectOption<CartItem>(select);
    const cartItems = await this.extended.export({
      select: {
        ...fieldsSelect,
        cart: {
          select: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
        productVariant: {
          select: {
            name: true,
          },
        },
      },
      where,
    });

    const data = this.excelUtilService.generateExcel({
      worksheets: [
        {
          sheetName: this.excelSheets[this.cartItemEntityName],
          data: cartItems.map(({ cart, cartItem, productVariant }) => ({
            ...cartItem,
            email: cart.user?.email,
            productVariantName: productVariant.name,
          })),
          fieldsMapping: {
            cartID: 'email',
            productVariantID: 'productVariantName',
          },
        },
      ],
    });

    return data;
  }

  async importCartItems({ file, user }: ImportCartItemsDto) {
    const cartItemSheetName = this.excelSheets[this.cartItemEntityName];
    const dataCreated = await this.excelUtilService.read(file);
    const data = await this.extended.createMany({
      data: dataCreated[cartItemSheetName].map((item) => ({
        ...item,
        user,
      })),
    });
    return data;
  }

  async deleteCartItem(where: Prisma.CartItemWhereUniqueInput) {
    const data = await this.extended.delete({ where });
    return data;
  }
}
