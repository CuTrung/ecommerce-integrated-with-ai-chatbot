import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { createZodDto } from 'nestjs-zod';
import { NotificationUncheckedCreateInputSchema } from '../../../generated/zod';

class CreateNotificationDto extends createZodDto(
  NotificationUncheckedCreateInputSchema,
) {}

class ImportNotificationsDto extends ImportExcel {}

export { CreateNotificationDto, ImportNotificationsDto };
