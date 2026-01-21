import { Injectable } from '@nestjs/common';
import {
  CreateProductVariantDto,
  ImportProductVariantsDto,
} from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import {
  ExportProductVariantsDto,
  GetProductVariantsPaginationDto,
} from './dto/get-product-variant.dto';
import { PrismaBaseService } from '../../common/services/prisma-base.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ExcelUtilService } from '../../common/utils/excel-util/excel-util.service';
import { ProductVariant } from './entities/product-variant.entity';
import { Prisma } from '@prisma/client';
import {
  GetOptionsParams,
  Options,
} from '../../common/query/options.interface';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';
import { QueryUtilService } from '../../common/utils/query-util/query-util.service';
import { WithUser } from '../../common/decorators/user.decorator';

@Injectable()
export class ProductVariantsService
  extends PrismaBaseService<'productVariant'>
  implements Options
{
  private productVariantEntityName = ProductVariant.name;
  private excelSheets = {
    [this.productVariantEntityName]: this.productVariantEntityName,
  };
  constructor(
    private excelUtilService: ExcelUtilService,
    public prismaService: PrismaService,
    private paginationUtilService: PaginationUtilService,
    private queryUtilService: QueryUtilService,
  ) {
    super(prismaService, 'productVariant');
  }

  get client() {
    return super.client;
  }

  get extended() {
    return super.extended;
  }

  async getProductVariant(where: Prisma.ProductVariantWhereUniqueInput) {
    const data = await this.extended.findUnique({
      where,
    });
    return data;
  }

  async getProductVariants({
    page,
    itemPerPage,
    select,
    ...search
  }: GetProductVariantsPaginationDto) {
    const totalItems = await this.extended.count();
    const paging = this.paginationUtilService.paging({
      page,
      itemPerPage,
      totalItems,
    });
    const fieldsSelect =
      this.queryUtilService.convertFieldsSelectOption<ProductVariant>(select);
    const searchQuery = this.queryUtilService.buildSearchQuery<ProductVariant>({
      search,
    });
    const list = await this.extended.findMany({
      select: fieldsSelect,
      skip: paging.skip,
      take: paging.itemPerPage,
      where: searchQuery,
      include: {
        product: {
          include: {
            productImages: true,
          },
        },
        productImages: true,
      },
    });

    const data = paging.format(list);
    return data;
  }

  async createProductVariant(
    createProductVariantDto: WithUser<CreateProductVariantDto>,
  ) {
    const data = await this.extended.create({
      data: createProductVariantDto,
    });
    return data;
  }

  async updateProductVariant(params: {
    where: Prisma.ProductVariantWhereUniqueInput;
    data: UpdateProductVariantDto;
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
        Omit<ProductVariant, 'attributes'>
      >(select);
    const searchQuery = this.queryUtilService.buildSearchQuery<
      Omit<ProductVariant, 'attributes'>
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

  async exportProductVariants({ ids, select }: ExportProductVariantsDto) {
    const where: Record<string, any> = {};
    if (ids) {
      where.id = { in: ids };
    }
    const fieldsSelect =
      this.queryUtilService.convertFieldsSelectOption<ProductVariant>(select);
    const productVariants = await this.extended.export({
      select: fieldsSelect,
      where,
    });

    const data = this.excelUtilService.generateExcel({
      worksheets: [
        {
          sheetName: this.excelSheets[this.productVariantEntityName],
          data: productVariants,
        },
      ],
    });

    return data;
  }

  async importProductVariants({ file, user }: ImportProductVariantsDto) {
    const productVariantSheetName =
      this.excelSheets[this.productVariantEntityName];
    const dataCreated = await this.excelUtilService.read(file);
    const data = await this.extended.createMany({
      data: dataCreated[productVariantSheetName].map((item) => ({
        ...item,
        user,
      })),
    });
    return data;
  }

  async deleteProductVariant(where: Prisma.ProductVariantWhereUniqueInput) {
    const data = await this.extended.softDelete(where);
    return data;
  }
}
