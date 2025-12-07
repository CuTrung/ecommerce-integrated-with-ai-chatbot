import { Pagination } from '../../../common/utils/pagination-util/pagination-util.interface';
import { ExportExcelDto } from '../../../common/dto/param.dto';

class GetOrderItemsPaginationDto extends Pagination {}

class ExportOrderItemsDto extends ExportExcelDto {}

export { GetOrderItemsPaginationDto, ExportOrderItemsDto };
