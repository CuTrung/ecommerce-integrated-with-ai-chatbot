import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { createZodDto } from 'nestjs-zod';
import { UserCreateInputSchema } from '../../../generated/zod';

export class CreateUserDto extends createZodDto(UserCreateInputSchema) {}

export class ImportUsersDto extends ImportExcel {}
