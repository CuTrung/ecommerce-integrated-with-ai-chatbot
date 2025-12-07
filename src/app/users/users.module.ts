import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ExcelUtilService } from '../../common/utils/excel-util/excel-util.service';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';
import { StringUtilService } from '../../common/utils/string-util/string-util.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    ExcelUtilService,
    PaginationUtilService,
    StringUtilService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
