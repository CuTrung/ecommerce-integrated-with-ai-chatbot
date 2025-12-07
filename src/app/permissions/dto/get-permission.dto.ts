import { Pagination } from '../../../common/utils/pagination-util/pagination-util.interface';
import { ExportExcelDto } from '../../../common/dto/param.dto';

class GetPermissionsPaginationDto extends Pagination {}

class ExportPermissionsDto extends ExportExcelDto {}

export { GetPermissionsPaginationDto, ExportPermissionsDto };
