import { Pagination } from '../../../common/utils/pagination-util/pagination-util.interface';
import { ExportExcelDto } from '../../../common/dto/param.dto';

class GetProductVariantsPaginationDto extends Pagination {}

class ExportProductVariantsDto extends ExportExcelDto {}

export { GetProductVariantsPaginationDto, ExportProductVariantsDto };
