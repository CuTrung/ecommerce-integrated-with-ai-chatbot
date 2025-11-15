import { Injectable } from '@nestjs/common';
import {
  ExportUserVendorRolesDto,
  RolesData,
  RolesImportCreate,
  UsersData,
  VendorsData,
} from './dto/get-user-vendor-role.dto';
import { ImportUserVendorRolesDto } from './dto/create-user-vendor-role.dto';
import { PrismaBaseService } from '../../common/services/prisma-base.service';
import { UserVendorRole } from './entities/user-vendor-role.entity';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ExcelUtilService } from '../../common/utils/excel-util/excel-util.service';
import { Prisma } from '@prisma/client';
import { RolesService } from '../roles/roles.service';
import { UsersService } from '../users/users.service';
import { VendorsService } from '../vendors/vendors.service';

@Injectable()
export class UserVendorRolesService extends PrismaBaseService<'userVendorRole'> {
  private userVendorRoleEntityName = UserVendorRole.name;
  private excelSheets = {
    [this.userVendorRoleEntityName]: this.userVendorRoleEntityName,
  };
  constructor(
    public prismaService: PrismaService,
    private excelUtilService: ExcelUtilService,
    private usersService: UsersService,
    private rolesService: RolesService,
    private vendorsService: VendorsService,
  ) {
    super(prismaService, 'userVendorRole');
  }

  get client() {
    return super.client;
  }

  get extended() {
    return super.extended;
  }

  async exportUserVendorRoles(params: ExportUserVendorRolesDto) {
    const { userIDs, roleIDs, vendorIDs } = params ?? {};
    const where: Prisma.UserVendorRoleWhereInput = {};

    if (userIDs) {
      where.userID = { in: userIDs };
    }

    if (vendorIDs) {
      where.vendorID = { in: vendorIDs };
    }

    if (roleIDs) {
      where.roleID = { in: roleIDs };
    }

    const userVendorRoles = await this.extended.export({
      select: {
        user: {
          select: {
            email: true,
          },
        },
        vendor: {
          select: {
            name: true,
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
          sheetName: this.excelSheets[this.userVendorRoleEntityName],
          fieldsMapping: {
            userID: 'userEmail',
            vendorID: 'vendorName',
          },
          fieldsExtend: ['roleName'],
          fieldsExclude: ['createdAt', 'createdBy'],
          data: userVendorRoles.map(({ user, role, vendor }) => ({
            userEmail: user.email,
            vendorName: vendor.name,
            roleName: role.name,
          })),
        },
      ],
    });

    return data;
  }

  async importUserVendorRoles({ file, user }: ImportUserVendorRolesDto) {
    const userVendorRoleSheetName =
      this.excelSheets[this.userVendorRoleEntityName];
    const dataCreated = await this.excelUtilService.read(file);
    const dataImport = dataCreated[userVendorRoleSheetName];
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

  async getUserVendorRoles() {
    const data = await this.extended.findMany({
      select: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        vendor: {
          select: {
            id: true,
            name: true,
            description: true,
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
