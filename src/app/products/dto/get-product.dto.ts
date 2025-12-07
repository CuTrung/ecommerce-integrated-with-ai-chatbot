import { Pagination } from '../../../common/utils/pagination-util/pagination-util.interface';
import { ExportExcelDto } from '../../../common/dto/param.dto';

class GetProductsPaginationDto extends Pagination {}

class ExportProductsDto extends ExportExcelDto {}

export { GetProductsPaginationDto, ExportProductsDto };
