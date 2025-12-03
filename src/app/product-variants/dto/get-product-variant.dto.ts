import { IntersectionType, PartialType } from '@nestjs/swagger';
import { Pagination } from '../../../common/utils/pagination-util/pagination-util.interface';
import { ProductVariant } from '../entities/product-variant.entity';
import { ExportExcelDto } from '../../../common/dto/param.dto';

class GetProductVariantsPaginationDto extends IntersectionType(
  Pagination,
  PartialType(ProductVariant),
) {}

class ExportProductVariantsDto extends ExportExcelDto {}

export { GetProductVariantsPaginationDto, ExportProductVariantsDto };
