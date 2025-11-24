import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { createZodDto } from 'nestjs-zod';
import { OrderCreateInputSchema } from '../../../generated/zod';

class CreateOrderDto extends createZodDto(OrderCreateInputSchema) {}

class ImportOrdersDto extends ImportExcel {}

export { CreateOrderDto, ImportOrdersDto };
