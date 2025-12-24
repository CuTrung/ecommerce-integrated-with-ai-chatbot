import { Injectable } from '@nestjs/common';
import { CreateVendorDto, ImportVendorsDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import {
  ExportVendorsDto,
  GetVendorsPaginationDto,
} from './dto/get-vendor.dto';
import { PrismaBaseService } from '../../common/services/prisma-base.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ExcelUtilService } from '../../common/utils/excel-util/excel-util.service';
import { Vendor } from './entities/vendor.entity';
import { Prisma } from '@prisma/client';
import {
  GetOptionsParams,
  Options,
} from '../../common/query/options.interface';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';
import { QueryUtilService } from '../../common/utils/query-util/query-util.service';

@Injectable()
export class VendorsService
  extends PrismaBaseService<'vendor'>
  implements Options
{
  private vendorEntityName = Vendor.name;
  private excelSheets = {
    [this.vendorEntityName]: this.vendorEntityName,
  };
  constructor(
    private excelUtilService: ExcelUtilService,
    public prismaService: PrismaService,
    private paginationUtilService: PaginationUtilService,
    private queryUtilService: QueryUtilService,
  ) {
    super(prismaService, 'vendor');
  }

  get client() {
    return super.client;
  }

  get extended() {
    return super.extended;
  }

  async getVendor(where: Prisma.VendorWhereUniqueInput) {
    const data = await this.extended.findUnique({
      where,
    });
    return data;
  }

  async getVendors({
    page,
    itemPerPage,
    select,
    ...search
  }: GetVendorsPaginationDto) {
    const totalItems = await this.extended.count();
    const paging = this.paginationUtilService.paging({
      page,
      itemPerPage,
      totalItems,
    });
    const fieldsSelect =
      this.queryUtilService.convertFieldsSelectOption<Vendor>(select);
    const searchQuery = this.queryUtilService.buildSearchQuery<Vendor>({
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

  async createVendor(createVendorDto: CreateVendorDto) {
    const data = await this.extended.create({
      data: createVendorDto,
    });
    return data;
  }

  async updateVendor(params: {
    where: Prisma.VendorWhereUniqueInput;
    data: UpdateVendorDto;
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
      this.queryUtilService.convertFieldsSelectOption<Vendor>(select);
    const searchQuery = this.queryUtilService.buildSearchQuery<Vendor>({
      search,
    });
    const data = await this.extended.findMany({
      select: fieldsSelect,
      take: limit,
      where: searchQuery,
    });
    return data;
  }

  async exportVendors({ ids, select }: ExportVendorsDto) {
    const where: Record<string, any> = {};
    if (ids) {
      where.id = { in: ids };
    }
    const fieldsSelect =
      this.queryUtilService.convertFieldsSelectOption<Vendor>(select);
    const vendors = await this.extended.export({
      select: fieldsSelect,
      where,
    });

    const data = this.excelUtilService.generateExcel({
      worksheets: [
        {
          sheetName: this.excelSheets[this.vendorEntityName],
          data: vendors,
        },
      ],
    });

    return data;
  }

  async importVendors({ file, user }: ImportVendorsDto) {
    const vendorSheetName = this.excelSheets[this.vendorEntityName];
    const dataCreated = await this.excelUtilService.read(file);
    const data = await this.extended.createMany({
      data: dataCreated[vendorSheetName].map((item) => ({
        ...item,
        user,
      })),
    });
    return data;
  }

  async deleteVendor(where: Prisma.VendorWhereUniqueInput) {
    const data = await this.extended.softDelete(where);
    return data;
  }
}
