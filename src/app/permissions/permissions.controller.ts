import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  Param,
  UseInterceptors,
  UploadedFile,
  Patch,
  Res,
} from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import {
  ExportPermissionsDto,
  GetPermissionsPaginationDto,
} from './dto/get-permission.dto';
import { ExcelResponseInterceptor } from '../../common/interceptors/excel-response/excel-response.interceptor';
import { PermissionsService } from './permissions.service';
import { User } from '../../common/decorators/user.decorator';
import type { UserInfo } from '../../common/decorators/user.decorator';
import type { Response } from 'express';
import type { File } from '../../common/utils/excel-util/dto/excel-util.interface';
import { GetOptionsParams } from '../../common/query/options.interface';
import { IDDto } from '../../common/dto/param.dto';
import { ImportExcel } from '../../common/utils/excel-util/excel-util.decorator';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  createPermission(
    @Body() createDto: CreatePermissionDto,
    @User() user: UserInfo,
  ) {
    return this.permissionsService.createPermission({ ...createDto, user });
  }

  @Patch(':id')
  updatePermission(
    @Param() { id }: IDDto,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.updatePermission({
      data: updatePermissionDto,
      where: { id },
    });
  }

  @Get()
  getPermissions(@Query() query: GetPermissionsPaginationDto) {
    return this.permissionsService.getPermissions(query);
  }

  @Get('options')
  getPermissionOptions(@Query() query: GetOptionsParams) {
    return this.permissionsService.getOptions(query);
  }

  @Post('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportPermissions(
    @Query() exportPermissionsDto: ExportPermissionsDto,
    @Res() res: Response,
  ) {
    const workbook =
      await this.permissionsService.exportPermissions(exportPermissionsDto);
    await workbook.xlsx.write(res);
    res.end();
    return { message: 'Export success' };
  }

  @Post('import')
  @ImportExcel()
  importPermissions(@UploadedFile() file: File, @User() user: UserInfo) {
    return this.permissionsService.importPermissions({ file, user });
  }

  @Get(':id')
  getPermission(@Param() { id }: IDDto) {
    return this.permissionsService.getPermission({ id });
  }

  @Delete(':id')
  deletePermission(@Param() { id }: IDDto) {
    return this.permissionsService.deletePermission({ id });
  }
}
