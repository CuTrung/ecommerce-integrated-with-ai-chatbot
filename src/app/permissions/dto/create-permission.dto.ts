import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { createZodDto } from 'nestjs-zod';
import { PermissionUncheckedCreateInputSchema } from '../../../generated/zod';

class CreatePermissionDto extends createZodDto(
  PermissionUncheckedCreateInputSchema,
) {}

class ImportPermissionsDto extends ImportExcel {}

export { CreatePermissionDto, ImportPermissionsDto };
