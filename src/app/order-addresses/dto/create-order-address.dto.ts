import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { createZodDto } from 'nestjs-zod';
import { OrderAddressUncheckedCreateInputSchema } from '../../../generated/zod';

class CreateOrderAddressDto extends createZodDto(
  OrderAddressUncheckedCreateInputSchema,
) {}

class ImportOrderAddressesDto extends ImportExcel {}

export { CreateOrderAddressDto, ImportOrderAddressesDto };
