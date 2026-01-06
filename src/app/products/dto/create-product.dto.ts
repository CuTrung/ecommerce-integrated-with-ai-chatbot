import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { createZodDto } from 'nestjs-zod';
import { ProductUncheckedCreateInputSchema } from '../../../generated/zod';

class CreateProductDto extends createZodDto(ProductUncheckedCreateInputSchema) {
  categoryIDs: string[];
}

class ImportProductsDto extends ImportExcel {}

class CreateProductCategoriesDto {
  productID: string;
  categoryIDs: string[];
}

export { CreateProductDto, ImportProductsDto, CreateProductCategoriesDto };
