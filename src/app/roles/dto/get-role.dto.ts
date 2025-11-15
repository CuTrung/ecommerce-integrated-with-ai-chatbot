import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { Prisma } from '@prisma/client';
import { Pagination } from '../../../common/utils/pagination-util/pagination-util.interface';
import { Role } from '../entities/role.entity';

class GetRolesPaginationDto extends IntersectionType(
  Pagination,
  PartialType(Role),
) {}

class ExportRolesDto {
  ids: NonNullable<Prisma.RoleWhereUniqueInput['id']>[];
}

export { GetRolesPaginationDto, ExportRolesDto };
