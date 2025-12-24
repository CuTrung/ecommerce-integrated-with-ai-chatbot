import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { createZodDto } from 'nestjs-zod';
import { CartItemUncheckedCreateInputSchema } from '../../../generated/zod';

class CreateCartItemDto extends createZodDto(
  CartItemUncheckedCreateInputSchema,
) {}

class ImportCartItemsDto extends ImportExcel {}

export { CreateCartItemDto, ImportCartItemsDto };
