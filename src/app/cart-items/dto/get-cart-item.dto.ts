import { Pagination } from '../../../common/utils/pagination-util/pagination-util.interface';
import { ExportExcelDto } from '../../../common/dto/param.dto';

class GetCartItemsPaginationDto extends Pagination {}

class ExportCartItemsDto extends ExportExcelDto {}

export { GetCartItemsPaginationDto, ExportCartItemsDto };
