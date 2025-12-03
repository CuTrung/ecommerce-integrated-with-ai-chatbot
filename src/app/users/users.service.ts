import { Injectable } from '@nestjs/common';
import { Prisma, VendorStatus } from '@prisma/client';
import { ExcelUtilService } from '../../common/utils/excel-util/excel-util.service';
import { CreateUserDto, ImportUsersDto } from './dto/create-user.dto';
import {
  ExportUsersDto,
  GetUsersPaginationDto,
  IsExistPermissionKeyDto,
} from './dto/get-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaBaseService } from '../../common/services/prisma-base.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Actions } from '../../common/guards/access-control/access-control.const';
import {
  GetOptionsParams,
  Options,
} from '../../common/query/options.interface';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';
import { QueryUtilService } from '../../common/utils/query-util/query-util.service';
@Injectable()
export class UsersService extends PrismaBaseService<'user'> implements Options {
  private userEntityName = User.name;
  private excelSheets = {
    [this.userEntityName]: this.userEntityName,
  };
  constructor(
    private excelUtilService: ExcelUtilService,
    public prismaService: PrismaService,
    private paginationUtilService: PaginationUtilService,
    private queryUtilService: QueryUtilService,
  ) {
    super(prismaService, 'user');
  }

  get client() {
    return super.client;
  }

  get extended() {
    return super.extended;
  }

  async getUser(where: Prisma.UserWhereUniqueInput) {
    const data = await this.extended.findUnique({
      where,
    });
    return data;
  }

  async getUsers({ page, itemPerPage }: GetUsersPaginationDto) {
    // const usersCacheKey = this.getUsers.name;
    // const usersCached = await this.cacheManager.get(usersCacheKey);
    // if (usersCached) return usersCached;

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
    // await this.cacheManager.set(usersCacheKey, data);
    return data;
  }

  async createUser(createUserDto: CreateUserDto) {
    const data = await this.extended.create({
      data: createUserDto,
    });
    return data;
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: UpdateUserDto;
  }) {
    const { where, data: dataUpdate } = params;
    const data = await this.extended.update({
      data: dataUpdate,
      where,
    });
    return data;
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput) {
    // const data = await this.extended.delete({
    //   where,
    // });
    const data = await this.extended.softDelete(where);
    return data;
  }

  async getOptions(params: GetOptionsParams) {
    const { limit, select, ...searchFields } = params;
    const fieldsSelect =
      this.queryUtilService.convertFieldsSelectOption<User>(select);
    const data = await this.client.findMany({
      select: fieldsSelect,
      where: {
        ...searchFields,
      },
      take: Number(limit),
    });
    return data;
  }

  async exportUsers({ ids, select }: ExportUsersDto) {
    const where: Record<string, any> = {};
    if (ids) {
      where.id = { in: ids };
    }
    const fieldsSelect =
      this.queryUtilService.convertFieldsSelectOption<User>(select);
    const users = await this.extended.export({
      select: fieldsSelect,
      where,
    });

    const data = this.excelUtilService.generateExcel({
      worksheets: [
        {
          sheetName: this.excelSheets[this.userEntityName],
          data: users,
        },
      ],
    });

    return data;
  }

  async importUsers({ file, user }: ImportUsersDto) {
    const userSheetName = this.excelSheets[this.userEntityName];
    const dataCreated = await this.excelUtilService.read(file);
    const data = await this.extended.createMany({
      data: dataCreated[userSheetName].map((item) => ({
        ...item,
        user,
      })),
    });
    return data;
  }

  async isSupperAdmin(userID: User['id']) {
    const data = await this.extended.findFirst({
      where: {
        id: userID,
        userVendorRoles: {
          some: {
            role: {
              isSystemRole: true,
            },
          },
        },
      },
    });
    return data ? true : false;
  }

  async isExistPermissionKey({
    userID,
    permissionKey,
  }: IsExistPermissionKeyDto) {
    const user = await this.extended.findFirst({
      include: {
        userVendorRoles: {
          select: {
            role: {
              select: {
                rolePermissions: {
                  select: {
                    permission: {
                      select: {
                        key: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      where: {
        id: userID,
        userVendorRoles: {
          some: { status: VendorStatus.active },
        },
      },
    });
    if (!user) return false;

    const [route] = permissionKey.split('_');
    const isExistPermission = user.userVendorRoles?.some((item) =>
      item.role?.rolePermissions?.some(
        (rp) =>
          rp.permission?.key?.includes(permissionKey) ||
          rp.permission?.key?.includes(`${route}_[${Actions.MANAGE}]`),
      ),
    );

    return isExistPermission ? true : false;
  }
}
