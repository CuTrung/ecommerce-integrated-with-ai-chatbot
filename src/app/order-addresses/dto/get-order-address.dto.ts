import { Pagination } from '../../../common/utils/pagination-util/pagination-util.interface';
import { ExportExcelDto } from '../../../common/dto/param.dto';

class GetOrderAddressesPaginationDto extends Pagination {}

class ExportOrderAddressesDto extends ExportExcelDto {}

export { GetOrderAddressesPaginationDto, ExportOrderAddressesDto };
