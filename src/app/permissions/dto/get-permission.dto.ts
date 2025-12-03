import { IntersectionType, PartialType } from '@nestjs/swagger';
import { Pagination } from '../../../common/utils/pagination-util/pagination-util.interface';
import { Permission } from '../entities/permission.entity';
import { ExportExcelDto } from '../../../common/dto/param.dto';

class GetPermissionsPaginationDto extends IntersectionType(
  Pagination,
  PartialType(Permission),
) {}

class ExportPermissionsDto extends ExportExcelDto {}

export { GetPermissionsPaginationDto, ExportPermissionsDto };
