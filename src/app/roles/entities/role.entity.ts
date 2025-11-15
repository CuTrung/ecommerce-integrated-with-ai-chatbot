import { Role as RolePrisma } from '@prisma/client';

export class Role implements RolePrisma {
  name: string;
  id: string;
  description: string | null;
  key: string;
  isSystemRole: boolean;
  createdAt: Date;
  createdBy: string | null;
  updatedAt: Date;
  deletedAt: Date | null;
}
