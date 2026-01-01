import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { createZodDto } from 'nestjs-zod';
import { UserUncheckedCreateInputSchema } from '../../../generated/zod';

export class CreateUserDto extends createZodDto(
  UserUncheckedCreateInputSchema,
) {}

export class CreateUserRolesDto {
  userID: string;
  roleIDs: string[];
}

export class ImportUsersDto extends ImportExcel {}
