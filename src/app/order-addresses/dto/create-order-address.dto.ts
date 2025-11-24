import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { createZodDto } from 'nestjs-zod';
import { OrderAddressCreateInputSchema } from '../../../generated/zod';

class CreateOrderAddressDto extends createZodDto(OrderAddressCreateInputSchema) {}

class ImportOrderAddresssDto extends ImportExcel {}

export { CreateOrderAddressDto, ImportOrderAddresssDto };
