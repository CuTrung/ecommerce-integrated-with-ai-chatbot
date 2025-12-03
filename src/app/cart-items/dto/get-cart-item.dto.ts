import { IntersectionType, PartialType } from '@nestjs/swagger';
import { Pagination } from '../../../common/utils/pagination-util/pagination-util.interface';
import { CartItem } from '../entities/cart-item.entity';
import { ExportExcelDto } from '../../../common/dto/param.dto';

class GetCartItemsPaginationDto extends IntersectionType(
  Pagination,
  PartialType(CartItem),
) {}

class ExportCartItemsDto extends ExportExcelDto {}

export { GetCartItemsPaginationDto, ExportCartItemsDto };
