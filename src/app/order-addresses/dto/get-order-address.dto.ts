import { IntersectionType, PartialType } from '@nestjs/swagger';
import { Pagination } from '../../../common/utils/pagination-util/pagination-util.interface';
import { OrderAddress } from '../entities/order-address.entity';
import { ExportExcelDto } from '../../../common/dto/param.dto';

class GetOrderAddressesPaginationDto extends IntersectionType(
  Pagination,
  PartialType(OrderAddress),
) {}

class ExportOrderAddressesDto extends ExportExcelDto {}

export { GetOrderAddressesPaginationDto, ExportOrderAddressesDto };
