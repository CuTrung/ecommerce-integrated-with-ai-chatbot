import { IntersectionType, PartialType } from '@nestjs/swagger';
import { Pagination } from '../../../common/utils/pagination-util/pagination-util.interface';
import { Category } from '../entities/category.entity';
import { ExportExcelDto } from '../../../common/dto/param.dto';

class GetCategoriesPaginationDto extends IntersectionType(
  Pagination,
  PartialType(Category),
) {}

class ExportCategoriesDto extends ExportExcelDto {}

export { GetCategoriesPaginationDto, ExportCategoriesDto };
