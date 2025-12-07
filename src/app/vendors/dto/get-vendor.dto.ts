import { Pagination } from '../../../common/utils/pagination-util/pagination-util.interface';
import { ExportExcelDto } from '../../../common/dto/param.dto';

class GetVendorsPaginationDto extends Pagination {}

class ExportVendorsDto extends ExportExcelDto {}

export { GetVendorsPaginationDto, ExportVendorsDto };
