import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { createZodDto } from 'nestjs-zod';
import { RoleUncheckedCreateInputSchema } from '../../../generated/zod';

class CreateRoleDto extends createZodDto(RoleUncheckedCreateInputSchema) {
  permissionIDs: string[];
}

class ImportRolesDto extends ImportExcel {}

class CreateRolePermissionsDto {
  roleID: string;
  permissionIDs: string[];
}

export { CreateRoleDto, ImportRolesDto, CreateRolePermissionsDto };
