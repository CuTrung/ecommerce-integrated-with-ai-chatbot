import { Injectable } from '@nestjs/common';
import {
  CreateCategoryDto,
  ImportCategoriesDto,
} from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  ExportCategoriesDto,
  GetCategoriesPaginationDto,
} from './dto/get-category.dto';
import { PrismaBaseService } from '../../common/services/prisma-base.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ExcelUtilService } from '../../common/utils/excel-util/excel-util.service';
import { Category } from './entities/category.entity';
import { Prisma } from '@prisma/client';
import {
  GetOptionsParams,
  Options,
} from '../../common/query/options.interface';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';
import { QueryUtilService } from '../../common/utils/query-util/query-util.service';
import { WithUser } from '../../common/decorators/user.decorator';

@Injectable()
export class CategoriesService
  extends PrismaBaseService<'category'>
  implements Options
{
  private categoryEntityName = Category.name;
  private excelSheets = {
    [this.categoryEntityName]: this.categoryEntityName,
  };
  constructor(
    private excelUtilService: ExcelUtilService,
    public prismaService: PrismaService,
    private paginationUtilService: PaginationUtilService,
    private queryUtilService: QueryUtilService,
  ) {
    super(prismaService, 'category');
  }

  get client() {
    return super.client;
  }

  get extended() {
    return super.extended;
  }

  async getCategory(where: Prisma.CategoryWhereUniqueInput) {
    const data = await this.extended.findUnique({
      where,
    });
    return data;
  }

  async getCategories({
    page,
    itemPerPage,
    select,
    ...search
  }: GetCategoriesPaginationDto) {
    const totalItems = await this.extended.count();
    const paging = this.paginationUtilService.paging({
      page,
      itemPerPage,
      totalItems,
    });
    const fieldsSelect =
      this.queryUtilService.convertFieldsSelectOption<Category>(select);
    const searchQuery = this.queryUtilService.buildSearchQuery<Category>({
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

  async createCategory(createCategoryDto: WithUser<CreateCategoryDto>) {
    const data = await this.extended.create({
      data: createCategoryDto,
    });
    return data;
  }

  async updateCategory(params: {
    where: Prisma.CategoryWhereUniqueInput;
    data: UpdateCategoryDto;
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
      this.queryUtilService.convertFieldsSelectOption<Category>(select);
    const searchQuery = this.queryUtilService.buildSearchQuery<Category>({
      search,
    });
    const data = await this.extended.findMany({
      select: fieldsSelect,
      take: limit,
      where: searchQuery,
    });
    return data;
  }

  async exportCategories({ ids, select }: ExportCategoriesDto) {
    const where: Record<string, any> = {};
    if (ids) {
      where.id = { in: ids };
    }
    const fieldsSelect =
      this.queryUtilService.convertFieldsSelectOption<Category>(select);
    const categories = await this.extended.export({
      select: fieldsSelect,
      where,
    });

    const data = this.excelUtilService.generateExcel({
      worksheets: [
        {
          sheetName: this.excelSheets[this.categoryEntityName],
          data: categories,
        },
      ],
    });

    return data;
  }

  async importCategories({ file, user }: ImportCategoriesDto) {
    const categorySheetName = this.excelSheets[this.categoryEntityName];
    const dataCreated = await this.excelUtilService.read(file);
    const data = await this.extended.createMany({
      data: dataCreated[categorySheetName].map((item) => ({
        ...item,
        user,
      })),
    });
    return data;
  }

  async deleteCategory(where: Prisma.CategoryWhereUniqueInput) {
    const data = await this.extended.softDelete(where);
    return data;
  }
}
