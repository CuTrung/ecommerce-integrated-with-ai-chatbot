import { Permission } from '../../permissions/entities/permission.entity';
import { Role } from '../../roles/entities/role.entity';

export class ExportRolePermissionsDto {
  roleIDs: Role['id'][];
  permissionIDs: Permission['id'][];
}

export type RolesData = Pick<Role, 'id' | 'name'>[];
export type RolesImportCreate = Pick<Role, 'name'>[];

export type PermissionsData = Pick<Permission, 'id' | 'name'>[];
export type PermissionsImportCreate = Pick<Permission, 'name' | 'key'>[];
