import { Pagination } from '../../../common/utils/pagination-util/pagination-util.interface';
import { ExportExcelDto } from '../../../common/dto/param.dto';

class GetNotificationsPaginationDto extends Pagination {}

class ExportNotificationsDto extends ExportExcelDto {}

export { GetNotificationsPaginationDto, ExportNotificationsDto };
