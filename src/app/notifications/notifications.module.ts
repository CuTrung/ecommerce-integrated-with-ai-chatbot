import { Module } from '@nestjs/common';
import { ExcelUtilModule } from '../../common/utils/excel-util/excel-util.module';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';

@Module({
  imports: [ExcelUtilModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, PaginationUtilService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
