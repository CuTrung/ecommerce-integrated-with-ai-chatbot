import { createZodDto } from 'nestjs-zod';
import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { ProductVariantCreateInputSchema } from '../../../generated/zod';

class CreateProductVariantDto extends createZodDto(
  ProductVariantCreateInputSchema,
) {}

class ImportProductVariantsDto extends ImportExcel {}

export { CreateProductVariantDto, ImportProductVariantsDto };
