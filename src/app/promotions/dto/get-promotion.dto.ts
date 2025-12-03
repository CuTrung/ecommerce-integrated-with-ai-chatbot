import { IntersectionType, PartialType } from '@nestjs/swagger';
import { Pagination } from '../../../common/utils/pagination-util/pagination-util.interface';
import { Promotion } from '../entities/promotion.entity';
import { ExportExcelDto } from '../../../common/dto/param.dto';

class GetPromotionsPaginationDto extends IntersectionType(
  Pagination,
  PartialType(Promotion),
) {}

class ExportPromotionsDto extends ExportExcelDto {}

export { GetPromotionsPaginationDto, ExportPromotionsDto };
