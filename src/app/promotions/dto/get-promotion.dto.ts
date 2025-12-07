import { Pagination } from '../../../common/utils/pagination-util/pagination-util.interface';
import { ExportExcelDto } from '../../../common/dto/param.dto';

class GetPromotionsPaginationDto extends Pagination {}

class ExportPromotionsDto extends ExportExcelDto {}

export { GetPromotionsPaginationDto, ExportPromotionsDto };
