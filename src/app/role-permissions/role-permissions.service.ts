import { Injectable } from '@nestjs/common';
import {
  ExportRolePermissionsDto,
  PermissionsData,
  PermissionsImportCreate,
  RolesData,
  RolesImportCreate,
} from './dto/get-role-permission.dto';
import { ImportRolePermissionsDto } from './dto/create-role-permission.dto';
import { PrismaBaseService } from '../../common/services/prisma-base.service';
import { RolePermission } from './entities/role-permission.entity';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ExcelUtilService } from '../../common/utils/excel-util/excel-util.service';
import { Prisma } from '@prisma/client';
import { RolesService } from '../roles/roles.service';
import { PermissionsService } from '../permissions/permissions.service';
import { QueryUtilService } from '../../common/utils/query-util/query-util.service';

@Injectable()
export class RolePermissionsService extends PrismaBaseService<'rolePermission'> {
  private rolePermissionEntityName = RolePermission.name;
  private excelSheets = {
    [this.rolePermissionEntityName]: this.rolePermissionEntityName,
  };
  constructor(
    public prismaService: PrismaService,
    private excelUtilService: ExcelUtilService,
    private rolesService: RolesService,
    private permissionsService: PermissionsService,
  ) {
    super(prismaService, 'rolePermission');
  }

  get client() {
    return super.client;
  }

  get extended() {
    return super.extended;
  }

  async exportRolePermissions(params: ExportRolePermissionsDto) {
    const { roleIDs, permissionIDs } = params ?? {};
    const where: Prisma.RolePermissionWhereInput = {};
    if (roleIDs) {
      where.roleID = { in: roleIDs };
    }

    if (permissionIDs) {
      where.permissionID = { in: permissionIDs };
    }

    const rolePermissions = await this.extended.export({
      select: {
        permission: {
          select: {
            name: true,
            key: true,
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
          sheetName: this.excelSheets[this.rolePermissionEntityName],
          fieldsMapping: {
            roleID: 'roleName',
            permissionID: 'permissionName',
          },
          fieldsExtend: ['permissionKey'],
          fieldsExclude: ['createdAt', 'createdBy'],
          data: rolePermissions.map(({ role, permission }) => ({
            roleName: role.name,
            permissionName: permission.name,
            permissionKey: permission.key,
          })),
        },
      ],
    });

    return data;
  }

  async importRolePermissions({ file, user }: ImportRolePermissionsDto) {
    const rolePermissionSheetName =
      this.excelSheets[this.rolePermissionEntityName];
    const dataCreated = await this.excelUtilService.read(file);
    const dataImport = dataCreated[rolePermissionSheetName];
    const { rolesImport, permissionsImport } = dataImport.reduce(
      (acc, item) => {
        const { roleName, permissionName, permissionKey } = item ?? {};
        acc.rolesImport.add({ roleName });
        acc.permissionsImport.add({ permissionName, permissionKey });
        return acc;
      },
      {
        rolesImport: new Set(),
        permissionsImport: new Set(),
      },
    );

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

    const permissionsData: PermissionsData = [];
    const permissionsCreate: PermissionsImportCreate = [];
    if (permissionsImport.size > 0) {
      const permissions = await this.permissionsService.client.findMany({
        select: { id: true, name: true },
      });
      const permissionNameListData = new Map();
      for (const permission of permissions) {
        permissionNameListData.set(permission.name, permission);
      }

      for (const permissionImport of permissionsImport) {
        const { permissionName, permissionKey } = permissionImport;
        const permissionCurrent = permissionNameListData.get(permissionName);
        if (permissionCurrent) {
          permissionsData.push(permissionCurrent);
        } else {
          permissionsCreate.push({ name: permissionName, key: permissionKey });
        }
      }

      const permissionsCreated =
        await this.permissionsService.extended.createManyAndReturn({
          data: permissionsCreate.map((permission) => ({
            ...permission,
            user,
          })),
          select: {
            id: true,
            name: true,
          },
        });
      permissionsData.push(...permissionsCreated);
    }

    const roleNameListData = new Map();
    for (const role of rolesData) {
      roleNameListData.set(role.name, role.id);
    }

    const permissionNameListData = new Map();
    for (const permission of permissionsData) {
      permissionNameListData.set(permission.name, permission.id);
    }

    const idsMapping = dataImport.map((item) => ({
      roleID: roleNameListData.get(item.roleName),
      permissionID: permissionNameListData.get(item.permissionName),
    }));

    await this.extended.deleteMany({
      where: { OR: idsMapping },
    });

    const data = await this.extended.createMany({
      data: idsMapping.map((item) => ({ ...item, user })),
    });
    return data;
  }

  async getRolePermissions() {
    const data = await this.extended.findMany({
      select: {
        permission: {
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
