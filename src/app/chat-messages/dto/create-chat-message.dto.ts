import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { createZodDto } from 'nestjs-zod';
import { ChatMessageUncheckedCreateInputSchema } from '../../../generated/zod';
import { z } from 'zod';

class CreateChatMessageDto extends createZodDto(
  ChatMessageUncheckedCreateInputSchema,
) {}

class ImportChatMessagesDto extends ImportExcel {}

class ChatDto extends createZodDto(
  z.object({
    question: z.string(),
    sessionID: z.string().default(crypto.randomUUID()),
  }),
) {}

export { CreateChatMessageDto, ImportChatMessagesDto, ChatDto };
