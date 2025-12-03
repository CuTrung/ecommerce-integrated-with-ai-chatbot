import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export class IDDto extends createZodDto(
  z.object({
    id: z.string().uuid(),
  }),
) {}

export class ExportExcelDto extends createZodDto(
  z.object({
    ids: z.array(z.string().uuid()).optional().nullable().default(null),
    select: z.string().optional().nullish().default(null),
  }),
) {}
