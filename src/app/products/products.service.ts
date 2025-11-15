import { Injectable } from '@nestjs/common';
import { CreateProductDto, ImportProductsDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ExportProductsDto,
  GetProductsPaginationDto,
} from './dto/get-product.dto';
import { PrismaBaseService } from '../../common/services/prisma-base.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ExcelUtilService } from '../../common/utils/excel-util/excel-util.service';
import { Product } from './entities/product.entity';
import { Prisma } from '@prisma/client';
import {
  GetOptionsParams,
  Options,
} from '../../common/query/options.interface';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';
import { QueryUtilService } from '../../common/utils/query-util/query-util.service';

@Injectable()
export class ProductsService
  extends PrismaBaseService<'product'>
  implements Options<Product>
{
  private productEntityName = Product.name;
  private excelSheets = {
    [this.productEntityName]: this.productEntityName,
  };
  constructor(
    private excelUtilService: ExcelUtilService,
    public prismaService: PrismaService,
    private paginationUtilService: PaginationUtilService,
    private queryUtil: QueryUtilService,
  ) {
    super(prismaService, 'product');
  }

  get client() {
    return super.client;
  }

  get extended() {
    return super.extended;
  }

  async getProduct(where: Prisma.ProductWhereUniqueInput) {
    const data = await this.extended.findUnique({
      where,
    });
    return data;
  }

  async getProducts({ page, itemPerPage }: GetProductsPaginationDto) {
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

  async createProduct(createProductDto: CreateProductDto) {
    const data = await this.extended.create({
      data: createProductDto,
    });
    return data;
  }

  async updateProduct(params: {
    where: Prisma.ProductWhereUniqueInput;
    data: UpdateProductDto;
  }) {
    const { where, data: dataUpdate } = params;
    const data = await this.extended.update({
      data: dataUpdate,
      where,
    });
    return data;
  }

  async getOptions(params: GetOptionsParams<Product>) {
    const { limit, select, ...searchFields } = params;
    const fieldsSelect = this.queryUtil.convertFieldsSelectOption(select);
    const data = await this.extended.findMany({
      select: fieldsSelect,
      where: {
        ...searchFields,
      },
      take: limit,
    });
    return data;
  }

  async exportProducts({ ids }: ExportProductsDto) {
    const products = await this.extended.export({
      where: {
        id: { in: ids },
      },
    });

    const data = this.excelUtilService.generateExcel({
      worksheets: [
        {
          sheetName: this.excelSheets[this.productEntityName],
          data: products,
        },
      ],
    });

    return data;
  }

  async importProducts({ file, user }: ImportProductsDto) {
    const productSheetName = this.excelSheets[this.productEntityName];
    const dataCreated = await this.excelUtilService.read(file);
    const data = await this.extended.createMany({
      data: dataCreated[productSheetName].map((item) => ({
        ...item,
        user,
      })),
    });
    return data;
  }

  async deleteProduct(where: Prisma.ProductWhereUniqueInput) {
    const data = await this.extended.softDelete(where);
    return data;
  }
}
