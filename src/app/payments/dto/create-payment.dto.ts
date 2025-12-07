import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { createZodDto } from 'nestjs-zod';
import { PaymentCreateInputSchema } from '../../../generated/zod';

class CreatePaymentDto extends createZodDto(PaymentCreateInputSchema) {}

class ImportPaymentsDto extends ImportExcel {}

export { CreatePaymentDto, ImportPaymentsDto };
