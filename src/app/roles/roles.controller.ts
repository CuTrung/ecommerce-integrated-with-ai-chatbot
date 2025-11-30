import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UsePipes,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelResponseInterceptor } from '../../common/interceptors/excel-response/excel-response.interceptor';
import { Role } from '@prisma/client';
import { RolesService } from './roles.service';
import { User } from '../../common/decorators/user.decorator';
import type { UserInfo } from '../../common/decorators/user.decorator';
import type { Response } from 'express';
import type { File } from '../../common/utils/excel-util/dto/excel-util.interface';
import type { GetOptionsParams } from '../../common/query/options.interface';
import { ParseParamsPaginationPipe } from '../../common/pipes/parse-params-pagination.pipe';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  createRole(@Body() createDto: CreateRoleDto, @User() user: UserInfo) {
    return this.rolesService.createRole({ ...createDto, user });
  }

  @Patch(':id')
  updateRole(
    @Param('id') id: Role['id'],
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.updateRole({
      data: updateRoleDto,
      where: { id },
    });
  }

  @Get()
  @UsePipes(ParseParamsPaginationPipe)
  getRoles(@Query() query: GetRolesPaginationDto) {
    return this.rolesService.getRoles(query);
  }

  @Get('options')
  getRoleOptions(@Query() query: GetOptionsParams<Role>) {
    return this.rolesService.getOptions(query);
  }

  @Get('export')
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
  @UseInterceptors(FileInterceptor('file'))
  importRoles(@UploadedFile() file: File, @User() user: UserInfo) {
    return this.rolesService.importRoles({ file, user });
  }

  @Get(':id')
  getRole(@Param('id') id: Role['id']) {
    return this.rolesService.getRole({ id });
  }

  @Delete(':id')
  deleteRole(@Param('id') id: Role['id']) {
    return this.rolesService.deleteRole({ id });
  }
}
