import { Pagination } from '../../../common/utils/pagination-util/pagination-util.interface';
import { ExportExcelDto } from '../../../common/dto/param.dto';

class GetCartsPaginationDto extends Pagination {}

class ExportCartsDto extends ExportExcelDto {}

export { GetCartsPaginationDto, ExportCartsDto };
