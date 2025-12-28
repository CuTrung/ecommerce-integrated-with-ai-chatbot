import { Module } from '@nestjs/common';
import { UserRolesService } from './user-roles.service';
import { UserRolesController } from './user-roles.controller';
import { ExcelUtilModule } from '../../common/utils/excel-util/excel-util.module';
import { RolesModule } from '../roles/roles.module';
import { UsersModule } from '../users/users.module';
import { VendorsModule } from '../vendors/vendors.module';

@Module({
  imports: [ExcelUtilModule, UsersModule, VendorsModule, RolesModule],
  controllers: [UserRolesController],
  providers: [UserRolesService],
})
export class UserRolesModule {}
