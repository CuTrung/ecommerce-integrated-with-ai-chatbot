import { Pagination } from '../../../common/utils/pagination-util/pagination-util.interface';
import { ExportExcelDto } from '../../../common/dto/param.dto';

class GetOrdersPaginationDto extends Pagination {}

class ExportOrdersDto extends ExportExcelDto {}

export { GetOrdersPaginationDto, ExportOrdersDto };
