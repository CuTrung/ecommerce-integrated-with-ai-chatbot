import { $Enums, Payment as PaymentPrisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class Payment implements PaymentPrisma {
  id: string;
  orderID: string;
  type: $Enums.PaymentType;
  status: $Enums.PaymentStatus;
  amount: Decimal;
  transactionID: string | null;
  createdAt: Date;
  createdBy: string | null;
  updatedAt: Date;
  deletedAt: Date | null;
}
