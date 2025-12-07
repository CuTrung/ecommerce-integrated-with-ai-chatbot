import { Pagination } from '../../../common/utils/pagination-util/pagination-util.interface';
import { ExportExcelDto } from '../../../common/dto/param.dto';

class GetCategoriesPaginationDto extends Pagination {}

class ExportCategoriesDto extends ExportExcelDto {}

export { GetCategoriesPaginationDto, ExportCategoriesDto };
