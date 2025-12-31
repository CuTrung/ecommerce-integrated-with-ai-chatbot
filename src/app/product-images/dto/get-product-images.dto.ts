import { ExportExcelDto } from '../../../common/dto/param.dto';
import { Pagination } from '../../../common/utils/pagination-util/pagination-util.interface';

class GetProductImagesPaginationDto extends Pagination {}

class ExportProductImagesDto extends ExportExcelDto {}

export { ExportProductImagesDto, GetProductImagesPaginationDto };
