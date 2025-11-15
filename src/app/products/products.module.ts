import { Module } from '@nestjs/common';
import { ExcelUtilModule } from '../../common/utils/excel-util/excel-util.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';

@Module({
  imports: [ExcelUtilModule],
  controllers: [ProductsController],
  providers: [ProductsService, PaginationUtilService],
  exports: [ProductsService],
})
export class ProductsModule {}
