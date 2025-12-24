import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { createZodDto } from 'nestjs-zod';
import { VendorUncheckedCreateInputSchema } from '../../../generated/zod';

class CreateVendorDto extends createZodDto(VendorUncheckedCreateInputSchema) {}

class ImportVendorsDto extends ImportExcel {}

export { CreateVendorDto, ImportVendorsDto };
