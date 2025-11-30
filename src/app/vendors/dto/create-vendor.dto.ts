import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { createZodDto } from 'nestjs-zod';
import { VendorCreateInputSchema } from '../../../generated/zod';

class CreateVendorDto extends createZodDto(VendorCreateInputSchema) {}

class ImportVendorsDto extends ImportExcel {}

export { CreateVendorDto, ImportVendorsDto };
