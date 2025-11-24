import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { createZodDto } from 'nestjs-zod';
import { OrderItemCreateInputSchema } from '../../../generated/zod';

class CreateOrderItemDto extends createZodDto(OrderItemCreateInputSchema) {}

class ImportOrderItemsDto extends ImportExcel {}

export { CreateOrderItemDto, ImportOrderItemsDto };
