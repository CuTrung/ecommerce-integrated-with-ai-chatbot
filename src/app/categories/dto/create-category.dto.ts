import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { createZodDto } from 'nestjs-zod';
import { CategoryUncheckedCreateInputSchema } from '../../../generated/zod';

class CreateCategoryDto extends createZodDto(
  CategoryUncheckedCreateInputSchema,
) {}

class ImportCategoriesDto extends ImportExcel {}

export { CreateCategoryDto, ImportCategoriesDto };
