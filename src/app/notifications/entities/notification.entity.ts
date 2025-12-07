import { Notification as NotificationPrisma } from '@prisma/client';

export class Notification implements NotificationPrisma {
  id: string;
  userID: string;
  title: string;
  message: string;
  isRead: boolean;
}
