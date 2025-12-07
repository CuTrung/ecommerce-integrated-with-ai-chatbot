import { Injectable } from '@nestjs/common';
import {
  CreateNotificationDto,
  ImportNotificationsDto,
} from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import {
  ExportNotificationsDto,
  GetNotificationsPaginationDto,
} from './dto/get-notification.dto';
import { PrismaBaseService } from '../../common/services/prisma-base.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ExcelUtilService } from '../../common/utils/excel-util/excel-util.service';
import { Notification } from './entities/notification.entity';
import { Prisma } from '@prisma/client';
import {
  GetOptionsParams,
  Options,
} from '../../common/query/options.interface';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';
import { QueryUtilService } from '../../common/utils/query-util/query-util.service';
import { WithUser } from '../../common/decorators/user.decorator';

@Injectable()
export class NotificationsService
  extends PrismaBaseService<'notification'>
  implements Options
{
  private notificationEntityName = Notification.name;
  private excelSheets = {
    [this.notificationEntityName]: this.notificationEntityName,
  };
  constructor(
    private excelUtilService: ExcelUtilService,
    public prismaService: PrismaService,
    private paginationUtilService: PaginationUtilService,
    private queryUtilService: QueryUtilService,
  ) {
    super(prismaService, 'notification');
  }

  get client() {
    return super.client;
  }

  get extended() {
    return super.extended;
  }

  async getNotification(where: Prisma.NotificationWhereUniqueInput) {
    const data = await this.extended.findUnique({
      where,
    });
    return data;
  }

  async getNotifications({
    page,
    itemPerPage,
    select,
    ...search
  }: GetNotificationsPaginationDto) {
    const totalItems = await this.extended.count();
    const paging = this.paginationUtilService.paging({
      page,
      itemPerPage,
      totalItems,
    });
    const fieldsSelect =
      this.queryUtilService.convertFieldsSelectOption<Notification>(select);
    const searchQuery = this.queryUtilService.buildSearchQuery<Notification>({
      search,
    });
    const list = await this.extended.findMany({
      select: fieldsSelect,
      skip: paging.skip,
      take: paging.itemPerPage,
      where: searchQuery,
    });

    const data = paging.format(list);
    return data;
  }

  async createNotification(
    createNotificationDto: WithUser<CreateNotificationDto>,
  ) {
    const data = await this.extended.create({
      data: createNotificationDto,
    });
    return data;
  }

  async updateNotification(params: {
    where: Prisma.NotificationWhereUniqueInput;
    data: UpdateNotificationDto;
  }) {
    const { where, data: dataUpdate } = params;
    const data = await this.extended.update({
      data: dataUpdate,
      where,
    });
    return data;
  }

  async getOptions(params: GetOptionsParams) {
    const { limit, select, ...search } = params;
    const fieldsSelect =
      this.queryUtilService.convertFieldsSelectOption<Notification>(select);
    const searchQuery = this.queryUtilService.buildSearchQuery<Notification>({
      search,
    });
    const data = await this.extended.findMany({
      select: fieldsSelect,
      take: limit,
      where: searchQuery,
    });
    return data;
  }

  async exportNotifications({ ids, select }: ExportNotificationsDto) {
    const where: Record<string, any> = {};
    if (ids) {
      where.id = { in: ids };
    }
    const fieldsSelect =
      this.queryUtilService.convertFieldsSelectOption<Notification>(select);
    const notifications = await this.extended.export({
      select: fieldsSelect,
      where,
    });

    const data = this.excelUtilService.generateExcel({
      worksheets: [
        {
          sheetName: this.excelSheets[this.notificationEntityName],
          data: notifications,
        },
      ],
    });

    return data;
  }

  async importNotifications({ file, user }: ImportNotificationsDto) {
    const notificationSheetName = this.excelSheets[this.notificationEntityName];
    const dataCreated = await this.excelUtilService.read(file);
    const data = await this.extended.createMany({
      data: dataCreated[notificationSheetName].map((item) => ({
        ...item,
        user,
      })),
    });
    return data;
  }

  async deleteNotification(where: Prisma.NotificationWhereUniqueInput) {
    const data = await this.extended.softDelete(where);
    return data;
  }
}
