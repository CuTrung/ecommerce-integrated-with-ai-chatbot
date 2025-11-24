import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { createZodDto } from 'nestjs-zod';
import { RoleCreateInputSchema } from '../../../generated/zod';

class CreateRoleDto extends createZodDto(RoleCreateInputSchema) {}

class ImportRolesDto extends ImportExcel {}

export { CreateRoleDto, ImportRolesDto };
