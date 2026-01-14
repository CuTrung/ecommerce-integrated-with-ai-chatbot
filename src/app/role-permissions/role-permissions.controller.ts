import {
  Controller,
  Body,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
  Get,
} from '@nestjs/common';
import { RolePermissionsService } from './role-permissions.service';
import { ExportRolePermissionsDto } from './dto/get-role-permission.dto';
import { ExcelResponseInterceptor } from '../../common/interceptors/excel-response/excel-response.interceptor';
import { ImportExcel } from '../../common/utils/excel-util/excel-util.decorator';

@Controller('role-permissions')
export class RolePermissionsController {
  constructor(
    private readonly rolePermissionsService: RolePermissionsService,
  ) {}

  @Get()
  getRolePermissions() {
    return this.rolePermissionsService.getRolePermissions();
  }

  @Post('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportRolePermissions(@Body() params: ExportRolePermissionsDto) {
    return this.rolePermissionsService.exportRolePermissions(params);
  }

  @Post('import')
  @ImportExcel()
  importRolePermissions(@UploadedFile() file, @Req() req) {
    return this.rolePermissionsService.importRolePermissions({
      file,
      user: req.user,
    });
  }
}
