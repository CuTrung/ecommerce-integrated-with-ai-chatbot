import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { createZodDto } from 'nestjs-zod';
import { PermissionCreateInputSchema } from '../../../generated/zod';

class CreatePermissionDto extends createZodDto(PermissionCreateInputSchema) {}

class ImportPermissionsDto extends ImportExcel {}

export { CreatePermissionDto, ImportPermissionsDto };
