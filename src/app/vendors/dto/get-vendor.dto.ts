import { IntersectionType, PartialType } from '@nestjs/swagger';
import { Pagination } from '../../../common/utils/pagination-util/pagination-util.interface';
import { Vendor } from '../entities/vendor.entity';
import { ExportExcelDto } from '../../../common/dto/param.dto';

class GetVendorsPaginationDto extends IntersectionType(
  Pagination,
  PartialType(Vendor),
) {}

class ExportVendorsDto extends ExportExcelDto {}

export { GetVendorsPaginationDto, ExportVendorsDto };
