import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { createZodDto } from 'nestjs-zod';
import { CategoryCreateInputSchema } from '../../../generated/zod';

class CreateCategoryDto extends createZodDto(CategoryCreateInputSchema) {}

class ImportCategoriesDto extends ImportExcel {}

export { CreateCategoryDto, ImportCategoriesDto };
