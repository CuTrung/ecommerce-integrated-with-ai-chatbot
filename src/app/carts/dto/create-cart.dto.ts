import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { createZodDto } from 'nestjs-zod';
import { CartCreateInputSchema } from '../../../generated/zod';

class CreateCartDto extends createZodDto(CartCreateInputSchema) {}

class ImportCartsDto extends ImportExcel {}

export { CreateCartDto, ImportCartsDto };
