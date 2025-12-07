import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { createZodDto } from 'nestjs-zod';
import { NotificationCreateInputSchema } from '../../../generated/zod';

class CreateNotificationDto extends createZodDto(
  NotificationCreateInputSchema,
) {}

class ImportNotificationsDto extends ImportExcel {}

export { CreateNotificationDto, ImportNotificationsDto };
