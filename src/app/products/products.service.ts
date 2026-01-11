import { Injectable } from '@nestjs/common';
import {
  CreateProductCategoriesDto,
  CreateProductDto,
  ImportProductsDto,
} from './dto/create-product.dto';
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
import { WithUser } from '../../common/decorators/user.decorator';

@Injectable()
export class ProductsService
  extends PrismaBaseService<'product'>
  implements Options
{
  private productEntityName = Product.name;
  private excelSheets = {
    [this.productEntityName]: this.productEntityName,
  };
  constructor(
    private excelUtilService: ExcelUtilService,
    public prismaService: PrismaService,
    private paginationUtilService: PaginationUtilService,
    private queryUtilService: QueryUtilService,
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
      include: {
        productImages: {
          where: {
            deletedAt: null,
          },
        },
        productCategories: {
          include: {
            category: true,
          },
        },
        productVariants: true,
        vendor: true,
      },
    });
    return data;
  }

  async getProducts({
    page,
    itemPerPage,
    select,
    ...search
  }: GetProductsPaginationDto) {
    const totalItems = await this.extended.count();
    const paging = this.paginationUtilService.paging({
      page,
      itemPerPage,
      totalItems,
    });
    const fieldsSelect =
      this.queryUtilService.convertFieldsSelectOption<Product>(select);
    const searchQuery = this.queryUtilService.buildSearchQuery<Product>({
      search,
    });
    const list = await this.extended.findMany({
      // select: fieldsSelect,
      skip: paging.skip,
      take: paging.itemPerPage,
      where: searchQuery,
      include: {
        productCategories: {
          include: {
            category: true,
          },
        },
      },
    });

    const data = paging.format(list);
    return data;
  }

  async createProductCategories({
    productID,
    categoryIDs,
    user,
  }: WithUser<CreateProductCategoriesDto>) {
    await this.prismaService.productCategory.deleteMany({
      where: { productID },
    });
    if (categoryIDs.length === 0) return;
    const dataCreate = categoryIDs.map((categoryID) => ({
      productID,
      categoryID,
      user,
    }));
    await this.prismaService.extended.productCategory.createMany({
      data: dataCreate,
    });
  }

  async createProduct({
    categoryIDs,
    ...createProductDto
  }: WithUser<CreateProductDto>) {
    const data = await this.extended.create({
      data: createProductDto,
    });
    if (categoryIDs) {
      const productID = data.id;
      await this.createProductCategories({
        productID,
        categoryIDs,
        user: createProductDto.user,
      });
    }
    return data;
  }

  async updateProduct(params: {
    where: Prisma.ProductWhereUniqueInput;
    data: WithUser<UpdateProductDto>;
  }) {
    const {
      where,
      data: { categoryIDs, user, ...dataUpdate },
    } = params;
    const data = await this.extended.update({
      data: dataUpdate,
      where,
    });

    if (categoryIDs) {
      await this.createProductCategories({
        productID: data.id,
        categoryIDs,
        user,
      });
    }
    return data;
  }

  async getOptions(params: GetOptionsParams) {
    const { limit, select, ...search } = params;
    const fieldsSelect =
      this.queryUtilService.convertFieldsSelectOption<Product>(select);
    const searchQuery = this.queryUtilService.buildSearchQuery<Product>({
      search,
    });
    const data = await this.extended.findMany({
      select: fieldsSelect,
      take: limit,
      where: searchQuery,
    });
    return data;
  }

  async exportProducts({ ids, select }: ExportProductsDto) {
    const where: Record<string, any> = {};
    if (ids) {
      where.id = { in: ids };
    }
    const fieldsSelect =
      this.queryUtilService.convertFieldsSelectOption<Product>(select);
    const products = await this.extended.export({
      select: fieldsSelect,
      where,
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
