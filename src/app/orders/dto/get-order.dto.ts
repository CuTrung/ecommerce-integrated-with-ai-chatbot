import { IntersectionType, PartialType } from '@nestjs/swagger';
import { Pagination } from '../../../common/utils/pagination-util/pagination-util.interface';
import { Order } from '../entities/order.entity';
import { ExportExcelDto } from '../../../common/dto/param.dto';

class GetOrdersPaginationDto extends IntersectionType(
  Pagination,
  PartialType(Order),
) {}

class ExportOrdersDto extends ExportExcelDto {}

export { GetOrdersPaginationDto, ExportOrdersDto };
