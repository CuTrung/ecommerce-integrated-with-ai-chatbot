import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { createZodDto } from 'nestjs-zod';
import { OrderUncheckedCreateInputSchema } from '../../../generated/zod';

class CreateOrderDto extends createZodDto(OrderUncheckedCreateInputSchema) {}

class ImportOrdersDto extends ImportExcel {}

export { CreateOrderDto, ImportOrdersDto };
