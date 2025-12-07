import { User } from '../entities/user.entity';
import { Pagination } from '../../../common/utils/pagination-util/pagination-util.interface';
import { ExportExcelDto } from '../../../common/dto/param.dto';

class ExportUsersDto extends ExportExcelDto {}

class IsExistPermissionKeyDto {
  userID: User['id'];
  permissionKey: string;
}

class GetUsersPaginationDto extends Pagination {}

export { ExportUsersDto, IsExistPermissionKeyDto, GetUsersPaginationDto };
