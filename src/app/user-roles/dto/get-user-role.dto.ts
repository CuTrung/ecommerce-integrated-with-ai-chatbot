import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { Role } from '../../roles/entities/role.entity';
import { User } from '../../users/entities/user.entity';

export class ExportUserRolesDto extends createZodDto(
  z.object({
    userIDs: z.array(z.string().uuid()).optional().nullish().default(null),
    roleIDs: z.array(z.string().uuid()).optional().nullish().default(null),
  }),
) {}

export type UsersData = Pick<User, 'id' | 'email'>[];

export type RolesData = Pick<Role, 'id' | 'name'>[];
export type RolesImportCreate = Pick<Role, 'name'>[];
