import { IntersectionType, PartialType } from '@nestjs/swagger';
import { Pagination } from '../../../common/utils/pagination-util/pagination-util.interface';
import { OrderItem } from '../entities/order-item.entity';
import { ExportExcelDto } from '../../../common/dto/param.dto';

class GetOrderItemsPaginationDto extends IntersectionType(
  Pagination,
  PartialType(OrderItem),
) {}

class ExportOrderItemsDto extends ExportExcelDto {}

export { GetOrderItemsPaginationDto, ExportOrderItemsDto };
