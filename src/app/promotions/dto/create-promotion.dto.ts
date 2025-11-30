import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { createZodDto } from 'nestjs-zod';
import { PromotionCreateInputSchema } from '../../../generated/zod';

class CreatePromotionDto extends createZodDto(PromotionCreateInputSchema) {}

class ImportPromotionsDto extends ImportExcel {}

export { CreatePromotionDto, ImportPromotionsDto };
