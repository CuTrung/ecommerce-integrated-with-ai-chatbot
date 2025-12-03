import { IntersectionType, PartialType } from '@nestjs/swagger';
import { Pagination } from '../../../common/utils/pagination-util/pagination-util.interface';
import { Cart } from '../entities/cart.entity';
import { ExportExcelDto } from '../../../common/dto/param.dto';

class GetCartsPaginationDto extends IntersectionType(
  Pagination,
  PartialType(Cart),
) {}

class ExportCartsDto extends ExportExcelDto {}

export { GetCartsPaginationDto, ExportCartsDto };
