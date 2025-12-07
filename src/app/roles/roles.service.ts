import { Injectable } from '@nestjs/common';
import { CreateRoleDto, ImportRolesDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ExportRolesDto, GetRolesPaginationDto } from './dto/get-role.dto';
import { PrismaBaseService } from '../../common/services/prisma-base.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ExcelUtilService } from '../../common/utils/excel-util/excel-util.service';
import { Role } from './entities/role.entity';
import { Prisma } from '@prisma/client';
import {
  GetOptionsParams,
  Options,
} from '../../common/query/options.interface';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';
import { QueryUtilService } from '../../common/utils/query-util/query-util.service';
import { WithUser } from '../../common/decorators/user.decorator';

@Injectable()
export class RolesService extends PrismaBaseService<'role'> implements Options {
  private roleEntityName = Role.name;
  private excelSheets = {
    [this.roleEntityName]: this.roleEntityName,
  };
  constructor(
    private excelUtilService: ExcelUtilService,
    public prismaService: PrismaService,
    private paginationUtilService: PaginationUtilService,
    private queryUtilService: QueryUtilService,
  ) {
    super(prismaService, 'role');
  }

  get client() {
    return super.client;
  }

  get extended() {
    return super.extended;
  }

  async getRole(where: Prisma.RoleWhereUniqueInput) {
    const data = await this.extended.findUnique({
      where,
    });
    return data;
  }

  async getRoles({ page, itemPerPage, select }: GetRolesPaginationDto) {
    const totalItems = await this.extended.count();
    const paging = this.paginationUtilService.paging({
      page,
      itemPerPage,
      totalItems,
    });
    const fieldsSelect =
      this.queryUtilService.convertFieldsSelectOption<Role>(select);
    const list = await this.extended.findMany({
      select: fieldsSelect,
      skip: paging.skip,
      take: paging.itemPerPage,
    });

    const data = paging.format(list);
    return data;
  }

  async createRole(createRoleDto: WithUser<CreateRoleDto>) {
    const data = await this.extended.create({
      data: createRoleDto,
    });
    return data;
  }

  async updateRole(params: {
    where: Prisma.RoleWhereUniqueInput;
    data: UpdateRoleDto;
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
      this.queryUtilService.convertFieldsSelectOption<Role>(select);
    const data = await this.extended.findMany({
      select: fieldsSelect,
      where: {
        ...searchFields,
      },
      take: limit,
    });
    return data;
  }

  async exportRoles({ ids, select }: ExportRolesDto) {
    const where: Record<string, any> = {};
    if (ids) {
      where.id = { in: ids };
    }
    const fieldsSelect =
      this.queryUtilService.convertFieldsSelectOption<Role>(select);
    const roles = await this.extended.export({
      select: fieldsSelect,
      where,
    });

    const data = this.excelUtilService.generateExcel({
      worksheets: [
        {
          sheetName: this.excelSheets[this.roleEntityName],
          data: roles,
        },
      ],
    });

    return data;
  }

  async importRoles({ file, user }: ImportRolesDto) {
    const roleSheetName = this.excelSheets[this.roleEntityName];
    const dataCreated = await this.excelUtilService.read(file);
    const data = await this.extended.createMany({
      data: dataCreated[roleSheetName].map((item) => ({
        ...item,
        user,
      })),
    });
    return data;
  }

  async deleteRole(where: Prisma.RoleWhereUniqueInput) {
    const data = await this.extended.softDelete(where);
    return data;
  }
}
