import {
  Controller,
  Body,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
  Get,
} from '@nestjs/common';
import { UserRolesService } from './user-roles.service';
import { ExportUserRolesDto } from './dto/get-user-role.dto';
import { ExcelResponseInterceptor } from '../../common/interceptors/excel-response/excel-response.interceptor';
import { ImportExcel } from '../../common/utils/excel-util/excel-util.decorator';

@Controller('user-roles')
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @Get()
  getUserRoles() {
    return this.userRolesService.getUserRoles();
  }

  @Post('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportUserRoles(@Body() params: ExportUserRolesDto) {
    return this.userRolesService.exportUserRoles(params);
  }

  @Post('import')
  @ImportExcel()
  importUserRoles(@UploadedFile() file, @Req() req) {
    return this.userRolesService.importUserRoles({
      file,
      user: req.user,
    });
  }
}
