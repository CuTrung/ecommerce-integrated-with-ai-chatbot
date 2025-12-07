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
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ExportRolesDto, GetRolesPaginationDto } from './dto/get-role.dto';
import { ExcelResponseInterceptor } from '../../common/interceptors/excel-response/excel-response.interceptor';
import { RolesService } from './roles.service';
import { User } from '../../common/decorators/user.decorator';
import type { UserInfo } from '../../common/decorators/user.decorator';
import type { Response } from 'express';
import type { File } from '../../common/utils/excel-util/dto/excel-util.interface';
import { GetOptionsParams } from '../../common/query/options.interface';
import { IDDto } from '../../common/dto/param.dto';
import { ImportExcel } from '../../common/utils/excel-util/excel-util.decorator';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  createRole(@Body() createDto: CreateRoleDto, @User() user: UserInfo) {
    return this.rolesService.createRole({ ...createDto, user });
  }

  @Patch(':id')
  updateRole(@Param() { id }: IDDto, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.updateRole({
      data: updateRoleDto,
      where: { id },
    });
  }

  @Get()
  getRoles(@Query() query: GetRolesPaginationDto) {
    return this.rolesService.getRoles(query);
  }

  @Get('options')
  getRoleOptions(@Query() query: GetOptionsParams) {
    return this.rolesService.getOptions(query);
  }

  @Post('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportRoles(
    @Query() exportRolesDto: ExportRolesDto,
    @Res() res: Response,
  ) {
    const workbook = await this.rolesService.exportRoles(exportRolesDto);
    await workbook.xlsx.write(res);
    res.end();
    return { message: 'Export success' };
  }

  @Post('import')
  @ImportExcel()
  importRoles(@UploadedFile() file: File, @User() user: UserInfo) {
    return this.rolesService.importRoles({ file, user });
  }

  @Get(':id')
  getRole(@Param() { id }: IDDto) {
    return this.rolesService.getRole({ id });
  }

  @Delete(':id')
  deleteRole(@Param() { id }: IDDto) {
    return this.rolesService.deleteRole({ id });
  }
}
