import { Module } from '@nestjs/common';
import { ExcelUtilModule } from '../../common/utils/excel-util/excel-util.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';

@Module({
  imports: [ExcelUtilModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaginationUtilService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
