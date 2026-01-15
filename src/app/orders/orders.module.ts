import { Module } from '@nestjs/common';
import { ExcelUtilModule } from '../../common/utils/excel-util/excel-util.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';
import { EventsGateway } from '../../events/events.gateway';
import { ProductVariantsModule } from '../product-variants/product-variants.module';

@Module({
  imports: [ExcelUtilModule, ProductVariantsModule],
  controllers: [OrdersController],
  providers: [OrdersService, PaginationUtilService, EventsGateway],
  exports: [OrdersService],
})
export class OrdersModule {}
