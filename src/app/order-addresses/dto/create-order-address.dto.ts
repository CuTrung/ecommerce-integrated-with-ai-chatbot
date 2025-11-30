import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { createZodDto } from 'nestjs-zod';
import { OrderAddressCreateInputSchema } from '../../../generated/zod';

class CreateOrderAddressDto extends createZodDto(
  OrderAddressCreateInputSchema,
) {}

class ImportOrderAddressesDto extends ImportExcel {}

export { CreateOrderAddressDto, ImportOrderAddressesDto };
