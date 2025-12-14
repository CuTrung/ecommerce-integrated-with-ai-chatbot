import { Module } from '@nestjs/common';
import { ExcelUtilModule } from '../../common/utils/excel-util/excel-util.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';
import { VnpayModule } from 'nestjs-vnpay';
import { ignoreLogger } from 'vnpay';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VNPAY_ENV } from './consts/env.const';

@Module({
  imports: [
    ExcelUtilModule,
    VnpayModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        tmnCode: configService.get<string>(VNPAY_ENV.VNPAY_TMN_CODE)!,
        secureSecret: configService.get<string>(VNPAY_ENV.VNPAY_SECURE_SECRET)!,
        vnpayHost: configService.get<string>(VNPAY_ENV.VNPAY_HOST)!,

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
  providers: [PaymentsService, PaginationUtilService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
