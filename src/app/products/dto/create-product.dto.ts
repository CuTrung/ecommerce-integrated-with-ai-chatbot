import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { createZodDto } from 'nestjs-zod';
import { ProductUncheckedCreateInputSchema } from '../../../generated/zod';

class CreateProductDto extends createZodDto(
  ProductUncheckedCreateInputSchema,
) {}

class ImportProductsDto extends ImportExcel {}

export { CreateProductDto, ImportProductsDto };
