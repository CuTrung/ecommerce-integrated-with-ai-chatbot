import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { createZodDto } from 'nestjs-zod';
import { PromotionUncheckedCreateInputSchema } from '../../../generated/zod';

class CreatePromotionDto extends createZodDto(
  PromotionUncheckedCreateInputSchema,
) {}

class ImportPromotionsDto extends ImportExcel {}

export { CreatePromotionDto, ImportPromotionsDto };
