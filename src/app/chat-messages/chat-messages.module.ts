import { Module } from '@nestjs/common';
import { ExcelUtilModule } from '../../common/utils/excel-util/excel-util.module';
import { ChatMessagesController } from './chat-messages.controller';
import { ChatMessagesService } from './chat-messages.service';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';
import { AIModule } from '../../common/services/ai/ai.module';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ExcelUtilModule, AIModule, UsersModule, ProductsModule],
  controllers: [ChatMessagesController],
  providers: [ChatMessagesService, PaginationUtilService],
  exports: [ChatMessagesService],
})
export class ChatMessagesModule {}
