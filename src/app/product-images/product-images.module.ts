import { Module } from '@nestjs/common';
import { ProductImagesService } from './product-images.service';
import { ProductImagesController } from './product-images.controller';
import { ExcelUtilService } from '../../common/utils/excel-util/excel-util.service';
import { FileUtilModule } from '../../common/utils/file-util/file-util.module';
import { PaginationUtilModule } from '../../common/utils/pagination-util/pagination-util.module';

@Module({
  imports: [FileUtilModule, PaginationUtilModule],
  controllers: [ProductImagesController],
  providers: [ProductImagesService, ExcelUtilService],
  exports: [ProductImagesService],
})
export class ProductImagesModule {}
