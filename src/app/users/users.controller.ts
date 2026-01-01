import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Query,
  UploadedFile,
  Res,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ExportUsersDto } from './dto/get-user.dto';
import { GetUsersPaginationDto } from './dto/get-user.dto';
import { User } from '../../common/decorators/user.decorator';
import type { UserInfo } from '../../common/decorators/user.decorator';
import type { File } from '../../common/utils/excel-util/dto/excel-util.interface';
import type { Response } from 'express';
import { ExcelResponseInterceptor } from '../../common/interceptors/excel-response/excel-response.interceptor';
import { GetOptionsParams } from '../../common/query/options.interface';
import { IDDto } from '../../common/dto/param.dto';
import { ParseParamsOptionPipe } from '../../common/pipes/parse-params-option.pipe';
import { ImportExcel } from '../../common/utils/excel-util/excel-util.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Post('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportUsers(
    @Body() exportUsersDto: ExportUsersDto,
    @Res() res: Response,
  ) {
    const workbook = await this.usersService.exportUsers(exportUsersDto);
    await workbook.xlsx.write(res);
    res.end();
    return { message: 'Export success' };
  }

  @Post('import')
  @ImportExcel()
  importUsers(@UploadedFile() file: File, @User() user: UserInfo) {
    return this.usersService.importUsers({ file, user });
  }

  @Get()
  getUsers(@Query() query: GetUsersPaginationDto) {
    return this.usersService.getUsers(query);
  }

  @Get('notifications')
  getUserNotifications(@User() user: UserInfo) {
    return this.usersService.getUserNotifications({ userID: user.userID });
  }

  @Get('options')
  @UsePipes(ParseParamsOptionPipe)
  getUserOptions(@Query() query: GetOptionsParams) {
    return this.usersService.getOptions(query);
  }

  @Get(':id')
  getUser(@Param() { id }: IDDto) {
    return this.usersService.getUser({ id });
  }

  @Patch(':id')
  updateUser(
    @Param() { id }: IDDto,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: UserInfo,
  ) {
    return this.usersService.updateUser({
      data: { user, ...updateUserDto },
      where: { id },
    });
  }

  @Delete(':id')
  deleteUser(@Param() { id }: IDDto) {
    return this.usersService.deleteUser({ id });
  }
}
