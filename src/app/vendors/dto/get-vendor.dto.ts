import { IntersectionType, PartialType } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Pagination } from '../../../common/utils/pagination-util/pagination-util.interface';
import { Vendor } from '../entities/vendor.entity';

class GetVendorsPaginationDto extends IntersectionType(
  Pagination,
  PartialType(Vendor),
) {}

class ExportVendorsDto {
  ids: NonNullable<Prisma.VendorWhereUniqueInput['id']>[];
}

export { GetVendorsPaginationDto, ExportVendorsDto };
