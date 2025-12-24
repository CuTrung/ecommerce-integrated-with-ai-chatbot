import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { File } from '../../../common/utils/excel-util/dto/excel-util.interface';
import { UserInfo } from '../../../common/decorators/user.decorator';
import { createZodDto } from 'nestjs-zod';
import { ProductImageUncheckedCreateInputSchema } from '../../../generated/zod';

export class CreateProductImageDto extends createZodDto(
  ProductImageUncheckedCreateInputSchema,
) {}

export class ImportProductImagesDto extends ImportExcel {}
export class UploadProductImagesDto {
  files: File[];
  user: UserInfo;
}
