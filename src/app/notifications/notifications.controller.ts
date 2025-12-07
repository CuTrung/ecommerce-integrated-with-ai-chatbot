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
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import {
  ExportNotificationsDto,
  GetNotificationsPaginationDto,
} from './dto/get-notification.dto';
import { ExcelResponseInterceptor } from '../../common/interceptors/excel-response/excel-response.interceptor';
import { NotificationsService } from './notifications.service';
import { User } from '../../common/decorators/user.decorator';
import type { UserInfo } from '../../common/decorators/user.decorator';
import type { Response } from 'express';
import type { File } from '../../common/utils/excel-util/dto/excel-util.interface';
import { GetOptionsParams } from '../../common/query/options.interface';
import { IDDto } from '../../common/dto/param.dto';
import { ImportExcel } from '../../common/utils/excel-util/excel-util.decorator';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  createNotification(
    @Body() createDto: CreateNotificationDto,
    @User() user: UserInfo,
  ) {
    return this.notificationsService.createNotification({ ...createDto, user });
  }

  @Patch(':id')
  updateNotification(
    @Param() { id }: IDDto,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.updateNotification({
      data: updateNotificationDto,
      where: { id },
    });
  }

  @Get()
  getNotifications(@Query() query: GetNotificationsPaginationDto) {
    return this.notificationsService.getNotifications(query);
  }

  @Get('options')
  getNotificationOptions(@Query() query: GetOptionsParams) {
    return this.notificationsService.getOptions(query);
  }

  @Post('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportNotifications(
    @Query() exportNotificationsDto: ExportNotificationsDto,
    @Res() res: Response,
  ) {
    const workbook = await this.notificationsService.exportNotifications(
      exportNotificationsDto,
    );
    await workbook.xlsx.write(res);
    res.end();
    return { message: 'Export success' };
  }

  @Post('import')
  @ImportExcel()
  importNotifications(@UploadedFile() file: File, @User() user: UserInfo) {
    return this.notificationsService.importNotifications({ file, user });
  }

  @Get(':id')
  getNotification(@Param() { id }: IDDto) {
    return this.notificationsService.getNotification({ id });
  }

  @Delete(':id')
  deleteNotification(@Param() { id }: IDDto) {
    return this.notificationsService.deleteNotification({ id });
  }
}
