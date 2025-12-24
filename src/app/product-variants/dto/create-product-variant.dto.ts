import { createZodDto } from 'nestjs-zod';
import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { ProductVariantUncheckedCreateInputSchema } from '../../../generated/zod';

class CreateProductVariantDto extends createZodDto(
  ProductVariantUncheckedCreateInputSchema,
) {}

class ImportProductVariantsDto extends ImportExcel {}

export { CreateProductVariantDto, ImportProductVariantsDto };
