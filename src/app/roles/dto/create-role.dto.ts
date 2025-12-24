import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { createZodDto } from 'nestjs-zod';
import { RoleUncheckedCreateInputSchema } from '../../../generated/zod';

class CreateRoleDto extends createZodDto(RoleUncheckedCreateInputSchema) {}

class ImportRolesDto extends ImportExcel {}

export { CreateRoleDto, ImportRolesDto };
