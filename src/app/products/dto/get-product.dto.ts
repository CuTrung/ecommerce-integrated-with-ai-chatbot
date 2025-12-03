import { IntersectionType, PartialType } from '@nestjs/swagger';
import { Pagination } from '../../../common/utils/pagination-util/pagination-util.interface';
import { Product } from '../entities/product.entity';
import { ExportExcelDto } from '../../../common/dto/param.dto';

class GetProductsPaginationDto extends IntersectionType(
  Pagination,
  PartialType(Product),
) {}

class ExportProductsDto extends ExportExcelDto {}

export { GetProductsPaginationDto, ExportProductsDto };
