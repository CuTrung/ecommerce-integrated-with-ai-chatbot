import { Injectable } from '@nestjs/common';
import {
  ExportUserRolesDto,
  RolesData,
  RolesImportCreate,
  UsersData,
  VendorsData,
} from './dto/get-user-role.dto';
import { ImportUserRolesDto } from './dto/create-user-role.dto';
import { PrismaBaseService } from '../../common/services/prisma-base.service';
import { UserRole } from './entities/user-role.entity';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ExcelUtilService } from '../../common/utils/excel-util/excel-util.service';
import { Prisma } from '@prisma/client';
import { RolesService } from '../roles/roles.service';
import { UsersService } from '../users/users.service';
import { VendorsService } from '../vendors/vendors.service';

@Injectable()
export class UserRolesService extends PrismaBaseService<'userRole'> {
  private userRoleEntityName = UserRole.name;
  private excelSheets = {
    [this.userRoleEntityName]: this.userRoleEntityName,
  };
  constructor(
    public prismaService: PrismaService,
    private excelUtilService: ExcelUtilService,
    private usersService: UsersService,
    private rolesService: RolesService,
    private vendorsService: VendorsService,
  ) {
    super(prismaService, 'userRole');
  }

  get client() {
    return super.client;
  }

  get extended() {
    return super.extended;
  }

  async exportUserRoles(params: ExportUserRolesDto) {
    const { userIDs, roleIDs } = params ?? {};
    const where: Prisma.UserRoleWhereInput = {};

    if (userIDs) {
      where.userID = { in: userIDs };
    }

    if (roleIDs) {
      where.roleID = { in: roleIDs };
    }

    const userRoles = await this.extended.export({
      select: {
        user: {
          select: {
            email: true,
          },
        },
        role: {
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
          sheetName: this.excelSheets[this.userRoleEntityName],
          fieldsMapping: {
            userID: 'userEmail',
          },
          fieldsExtend: ['roleName'],
          fieldsExclude: ['createdAt', 'createdBy'],
          data: userRoles.map(({ user, role }) => ({
            userEmail: user.email,
            roleName: role.name,
          })),
        },
      ],
    });

    return data;
  }

  async importUserRoles({ file, user }: ImportUserRolesDto) {
    const userRoleSheetName = this.excelSheets[this.userRoleEntityName];
    const dataCreated = await this.excelUtilService.read(file);
    const dataImport = dataCreated[userRoleSheetName];
    const { usersImport, vendorsImport, rolesImport } = dataImport.reduce(
      (acc, item) => {
        const { userEmail, vendorName, roleName } = item ?? {};
        acc.usersImport.add({ email: userEmail });
        acc.vendorsImport.add({ vendorName });
        acc.rolesImport.add({ roleName });
        return acc;
      },
      {
        usersImport: new Set(),
        rolesImport: new Set(),
        vendorsImport: new Set(),
      },
    );

    const usersData: UsersData = [];
    if (usersImport.size > 0) {
      const users = await this.usersService.client.findMany({
        select: { id: true, email: true },
      });
      const userEmailListData = new Map();
      for (const user of users) {
        userEmailListData.set(user.email, user);
      }

      for (const userImport of usersImport) {
        const { userEmail } = userImport;
        const userCurrent = userEmailListData.get(userEmail);
        if (userCurrent) {
          usersData.push(userCurrent);
        }
      }
    }

    const vendorsData: VendorsData = [];
    if (vendorsImport.size > 0) {
      const vendors = await this.vendorsService.client.findMany({
        select: { id: true, name: true },
      });
      const vendorNameListData = new Map();
      for (const vendor of vendors) {
        vendorNameListData.set(vendor.name, vendor);
      }

      for (const vendorImport of vendorsImport) {
        const { vendorName } = vendorImport;
        const vendorCurrent = vendorNameListData.get(vendorName);
        if (vendorCurrent) {
          vendorsData.push(vendorCurrent);
        }
      }
    }

    const rolesData: RolesData = [];
    const rolesCreate: RolesImportCreate = [];
    if (rolesImport.size > 0) {
      const roles = await this.rolesService.client.findMany({
        select: { id: true, name: true },
      });
      const roleNameListData = new Map();
      for (const role of roles) {
        roleNameListData.set(role.name, role);
      }

      for (const roleImport of rolesImport) {
        const { roleName } = roleImport;
        const roleCurrent = roleNameListData.get(roleName);
        if (roleCurrent) {
          rolesData.push(roleCurrent);
        } else {
          rolesCreate.push({ name: roleName });
        }
      }
      const rolesCreated = await this.rolesService.extended.createManyAndReturn(
        {
          data: rolesCreate.map((role) => ({ ...role, user })),
          select: {
            id: true,
            name: true,
          },
        },
      );
      rolesData.push(...rolesCreated);
    }

    const userNameListData = new Map();
    for (const user of usersData) {
      userNameListData.set(user.email, user.id);
    }

    const vendorNameListData = new Map();
    for (const vendor of vendorsData) {
      vendorNameListData.set(vendor.name, vendor.id);
    }

    const roleNameListData = new Map();
    for (const role of rolesData) {
      roleNameListData.set(role.name, role.id);
    }

    const idsMapping = dataImport.map((item) => ({
      userID: userNameListData.get(item.userEmail),
      roleID: roleNameListData.get(item.roleName),
      vendorID: vendorNameListData.get(item.vendorName),
    }));

    await this.extended.deleteMany({
      where: { OR: idsMapping },
    });

    const data = await this.extended.createMany({
      data: idsMapping.map((item) => ({ ...item, user })),
    });
    return data;
  }

  async getUserRoles() {
    const data = await this.extended.findMany({
      select: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        role: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    return data;
  }
}
