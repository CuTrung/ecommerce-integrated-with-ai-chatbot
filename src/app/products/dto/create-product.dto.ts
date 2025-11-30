import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { createZodDto } from 'nestjs-zod';
import { ProductCreateInputSchema } from '../../../generated/zod';

class CreateProductDto extends createZodDto(ProductCreateInputSchema) {}

class ImportProductsDto extends ImportExcel {}

export { CreateProductDto, ImportProductsDto };
