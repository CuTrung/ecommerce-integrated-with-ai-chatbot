import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { PaymentUncheckedCreateInputSchema } from '../../../generated/zod';
import { IntersectionType, PickType } from '@nestjs/swagger';
import { CreateOrderDto } from '../../orders/dto/create-order.dto';
import { createZodDto } from 'nestjs-zod';
import { Payment } from '../entities/payment.entity';

class CreatePaymentDto extends IntersectionType(
  createZodDto(PaymentUncheckedCreateInputSchema),
  PickType(CreateOrderDto, ['orderNumber', 'totalAmount']),
  PickType(Payment, ['orderID']),
) {}

class ImportPaymentsDto extends ImportExcel {}

export { CreatePaymentDto, ImportPaymentsDto };
