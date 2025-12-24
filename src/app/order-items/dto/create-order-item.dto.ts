import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { createZodDto } from 'nestjs-zod';
import { OrderItemUncheckedCreateInputSchema } from '../../../generated/zod';

class CreateOrderItemDto extends createZodDto(
  OrderItemUncheckedCreateInputSchema,
) {}

class ImportOrderItemsDto extends ImportExcel {}

export { CreateOrderItemDto, ImportOrderItemsDto };
