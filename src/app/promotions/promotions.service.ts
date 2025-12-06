import { Injectable } from '@nestjs/common';
import {
  CreatePromotionDto,
  ImportPromotionsDto,
} from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import {
  ExportPromotionsDto,
  GetPromotionsPaginationDto,
} from './dto/get-promotion.dto';
import { PrismaBaseService } from '../../common/services/prisma-base.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ExcelUtilService } from '../../common/utils/excel-util/excel-util.service';
import { Promotion } from './entities/promotion.entity';
import { Prisma } from '@prisma/client';
import {
  GetOptionsParams,
  Options,
} from '../../common/query/options.interface';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';
import { QueryUtilService } from '../../common/utils/query-util/query-util.service';
import { WithUser } from '../../common/decorators/user.decorator';

@Injectable()
export class PromotionsService
  extends PrismaBaseService<'promotion'>
  implements Options
{
  private promotionEntityName = Promotion.name;
  private excelSheets = {
    [this.promotionEntityName]: this.promotionEntityName,
  };
  constructor(
    private excelUtilService: ExcelUtilService,
    public prismaService: PrismaService,
    private paginationUtilService: PaginationUtilService,
    private queryUtilService: QueryUtilService,
  ) {
    super(prismaService, 'promotion');
  }

  get client() {
    return super.client;
  }

  get extended() {
    return super.extended;
  }

  async getPromotion(where: Prisma.PromotionWhereUniqueInput) {
    const data = await this.extended.findUnique({
      where,
    });
    return data;
  }

  async getPromotions({ page, itemPerPage }: GetPromotionsPaginationDto) {
    const totalItems = await this.extended.count();
    const paging = this.paginationUtilService.paging({
      page,
      itemPerPage,
      totalItems,
    });
    const list = await this.extended.findMany({
      skip: paging.skip,
      take: paging.itemPerPage,
    });

    const data = paging.format(list);
    return data;
  }

  async createPromotion(createPromotionDto: WithUser<CreatePromotionDto>) {
    const data = await this.extended.create({
      data: createPromotionDto,
    });
    return data;
  }

  async updatePromotion(params: {
    where: Prisma.PromotionWhereUniqueInput;
    data: UpdatePromotionDto;
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
      this.queryUtilService.convertFieldsSelectOption<Promotion>(select);
    const data = await this.extended.findMany({
      select: fieldsSelect,
      where: {
        ...searchFields,
      },
      take: Number(limit),
    });
    return data;
  }

  async exportPromotions({ ids, select }: ExportPromotionsDto) {
    const where: Record<string, any> = {};
    if (ids) {
      where.id = { in: ids };
    }
    const fieldsSelect =
      this.queryUtilService.convertFieldsSelectOption<Promotion>(select);
    const promotions = await this.extended.export({
      select: fieldsSelect,
      where,
    });

    const data = this.excelUtilService.generateExcel({
      worksheets: [
        {
          sheetName: this.excelSheets[this.promotionEntityName],
          data: promotions,
        },
      ],
    });

    return data;
  }

  async importPromotions({ file, user }: ImportPromotionsDto) {
    const promotionSheetName = this.excelSheets[this.promotionEntityName];
    const dataCreated = await this.excelUtilService.read(file);
    const data = await this.extended.createMany({
      data: dataCreated[promotionSheetName].map((item) => ({
        ...item,
        user,
      })),
    });
    return data;
  }

  async deletePromotion(where: Prisma.PromotionWhereUniqueInput) {
    const data = await this.extended.softDelete(where);
    return data;
  }
}
