import { UserSchema } from '../../../generated/zod';
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const forgotPasswordSchema = z.object({
  email: UserSchema.shape.email,
  phone: UserSchema.shape.phone,
  redirectTo: z.string().url().optional(),
});

export class ForgotPasswordDto extends createZodDto(forgotPasswordSchema) {}

const resetPasswordSchema = z.object({
  password: UserSchema.shape.password,
});

export class ResetPasswordDto extends createZodDto(resetPasswordSchema) {}
