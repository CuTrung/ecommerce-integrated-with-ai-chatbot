import { ZodValidationPipe, ZodSerializerInterceptor } from 'nestjs-zod';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { PrismaModule } from '../common/prisma/prisma.module';
import { LoggerModule } from '../logger/logger.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { LoggingInterceptor } from '../logger/logging.interceptor';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { StringUtilModule } from '../common/utils/string-util/string-util.module';
import { AuthGuard } from './auth/auth.guard';
import { DateUtilModule } from '../common/utils/date-util/date-util.module';
import { CatchEverythingFilter } from '../catch-everything/catch-everything.filter';
import { ZodExceptionFilter } from '../catch-everything/zod-exception/zod-exception.filter';
import { ApiUtilModule } from '../common/utils/api-util/api-util.module';
import { FormatResponseInterceptor } from '../common/interceptors/format-response/format-response.interceptor';
import { ExcelUtilModule } from '../common/utils/excel-util/excel-util.module';
import { ProductImagesModule } from './product-images/product-images.module';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { CacheUtilModule } from '../common/utils/cache-util/cache-util.module';
import { RateLimitModule } from '../common/security/rate-limit/rate-limit.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AccessControlGuard } from '../common/guards/access-control/access-control.guard';
import { PaginationUtilModule } from '../common/utils/pagination-util/pagination-util.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { RolePermissionsModule } from './role-permissions/role-permissions.module';
import { validate } from '../common/envs/validate.env';
import { CartsModule } from './carts/carts.module';
import { CartItemsModule } from './cart-items/cart-items.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { OrderAddressesModule } from './order-addresses/order-addresses.module';
import { OrderItemsModule } from './order-items/order-items.module';
import { OrderPromotionsModule } from './order-promotions/order-promotions.module';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { ProductVariantsModule } from './product-variants/product-variants.module';
import { ProductsModule } from './products/products.module';
import { PromotionsModule } from './promotions/promotions.module';
import { VendorsModule } from './vendors/vendors.module';
import { QueryUtilModule } from '../common/utils/query-util/query-util.module';
import { UserVendorRolesModule } from './user-vendor-roles/user-vendor-roles.module';
import { EventsModule } from '../events/events.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ParseParamsPaginationPipe } from '../common/pipes/parse-params-pagination.pipe';
import { ParseParamsOptionPipe } from '../common/pipes/parse-params-option.pipe';
import { ChatMessagesModule } from './chat-messages/chat-messages.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      validate: validate,
    }),
    EventEmitterModule.forRoot(),
    CacheUtilModule,
    PrismaModule,
    LoggerModule,
    RateLimitModule,
    UsersModule,
    StringUtilModule,
    AuthModule,
    DateUtilModule,
    ApiUtilModule,
    ExcelUtilModule,
    ProductImagesModule,
    PaginationUtilModule,
    PermissionsModule,
    RolesModule,
    RolePermissionsModule,
    CartsModule,
    CartItemsModule,
    CategoriesModule,
    OrdersModule,
    OrderItemsModule,
    OrderAddressesModule,
    OrderPromotionsModule,
    ProductCategoriesModule,
    ProductVariantsModule,
    ProductsModule,
    PromotionsModule,
    VendorsModule,
    QueryUtilModule,
    UserVendorRolesModule,
    EventsModule,
    ScheduleModule.forRoot(),
    ChatMessagesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ZodExceptionFilter,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AccessControlGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ParseParamsPaginationPipe,
    },
    {
      provide: APP_PIPE,
      useClass: ParseParamsOptionPipe,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: CatchEverythingFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: FormatResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
