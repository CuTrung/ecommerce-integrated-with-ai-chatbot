import { IntersectionType, PartialType } from '@nestjs/swagger';
import { Pagination } from '../../../common/utils/pagination-util/pagination-util.interface';
import { Role } from '../entities/role.entity';
import { ExportExcelDto } from '../../../common/dto/param.dto';

class GetRolesPaginationDto extends IntersectionType(
  Pagination,
  PartialType(Role),
) {}

class ExportRolesDto extends ExportExcelDto {}

export { GetRolesPaginationDto, ExportRolesDto };
