import { $Enums, UserRole as UserRolePrisma } from '@prisma/client';

export class UserRole implements UserRolePrisma {
  id: string;
  userID: string;
  roleID: string;
  status: $Enums.UserRoleStatus;
  createdAt: Date;
  createdBy: string | null;
}
