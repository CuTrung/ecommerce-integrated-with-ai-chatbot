import { ExportExcelDto } from '../../../common/dto/param.dto';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

class GetChatMessagesDto extends createZodDto(
  z
    .object({
      select: z.string().optional(),
    })
    .passthrough(),
) {}

class ExportChatMessagesDto extends ExportExcelDto {}

class GetLastMessagesDto {
  userID: string;
  sessionID: string;
  limit?: number;
}

export { GetChatMessagesDto, ExportChatMessagesDto, GetLastMessagesDto };
