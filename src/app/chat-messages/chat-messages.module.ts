import { Module } from '@nestjs/common';
import { ExcelUtilModule } from '../../common/utils/excel-util/excel-util.module';
import { ChatMessagesController } from './chat-messages.controller';
import { ChatMessagesService } from './chat-messages.service';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { OrdersModule } from '../orders/orders.module';
import { ProductVariantsModule } from '../product-variants/product-variants.module';
import { StringUtilModule } from '../../common/utils/string-util/string-util.module';

@Module({
  imports: [
    ExcelUtilModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    ProductVariantsModule,
    StringUtilModule,
  ],
  controllers: [ChatMessagesController],
  providers: [ChatMessagesService],
  exports: [ChatMessagesService],
})
export class ChatMessagesModule {}
