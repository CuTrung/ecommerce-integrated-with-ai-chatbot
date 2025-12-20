import { ChatMessage as ChatMessagePrisma } from '@prisma/client';

export class ChatMessage implements ChatMessagePrisma {
  id: string;
  userID: string;
  message: string;
  parentID: string | null;
  sessionID: string;
  context: string | null;
  createdAt: Date;
  createdBy: string | null;
  deletedAt: Date | null;
}
