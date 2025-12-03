import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export class ExportOrderPromotionsDto extends createZodDto(
  z.object({
    orderIDs: z.array(z.string().uuid()).optional().nullish().default(null),
    promotionIDs: z.array(z.string().uuid()).optional().nullish().default(null),
  }),
) {}
