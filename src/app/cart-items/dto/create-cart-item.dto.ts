import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { createZodDto } from 'nestjs-zod';
import { CartItemCreateInputSchema } from '../../../generated/zod';

class CreateCartItemDto extends createZodDto(CartItemCreateInputSchema) {}

class ImportCartItemsDto extends ImportExcel {}

export { CreateCartItemDto, ImportCartItemsDto };
