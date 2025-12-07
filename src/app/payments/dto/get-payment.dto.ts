import { Pagination } from '../../../common/utils/pagination-util/pagination-util.interface';
import { ExportExcelDto } from '../../../common/dto/param.dto';

class GetPaymentsPaginationDto extends Pagination {}

class ExportPaymentsDto extends ExportExcelDto {}

export { GetPaymentsPaginationDto, ExportPaymentsDto };
