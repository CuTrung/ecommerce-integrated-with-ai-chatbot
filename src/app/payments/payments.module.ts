import { Module } from '@nestjs/common';
import { ExcelUtilModule } from '../../common/utils/excel-util/excel-util.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';
import { VnpayModule } from 'nestjs-vnpay';
import { ignoreLogger } from 'vnpay';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvVars } from '../../common/envs/validate.env';
import { EventsGateway } from '../../events/events.gateway';

@Module({
  imports: [
    ExcelUtilModule,
    VnpayModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        tmnCode: configService.get<string>(EnvVars.VNPAY_TMN_CODE)!,
        secureSecret: configService.get<string>(EnvVars.VNPAY_SECURE_SECRET)!,
        vnpayHost: configService.get<string>(EnvVars.VNPAY_HOST)!,

        // Cấu hình tùy chọn
        testMode: true, // Chế độ test (ghi đè vnpayHost thành sandbox nếu là true)
        // hashAlgorithm: 'SHA512', // Thuật toán mã hóa
        enableLog: true, // Bật/tắt ghi log
        loggerFn: ignoreLogger, // Hàm xử lý log tùy chỉnh
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaginationUtilService, EventsGateway],
  exports: [PaymentsService],
})
export class PaymentsModule {}
