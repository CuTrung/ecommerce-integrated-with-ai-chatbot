import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { createZodDto } from 'nestjs-zod';
import { CartUncheckedCreateInputSchema } from '../../../generated/zod';

class CreateCartDto extends createZodDto(CartUncheckedCreateInputSchema) {}

class ImportCartsDto extends ImportExcel {}

export { CreateCartDto, ImportCartsDto };
