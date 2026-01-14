import { Controller, Get, Post, Query, UseInterceptors } from '@nestjs/common';
import {
  ExportPaymentsDto,
  GetPaymentsPaginationDto,
} from './dto/get-payment.dto';
import { ExcelResponseInterceptor } from '../../common/interceptors/excel-response/excel-response.interceptor';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // @Post()
  // createPayment(@Body() createDto: CreatePaymentDto, @User() user: UserInfo) {
  //   return this.paymentsService.createPayment({ ...createDto, user });
  // }

  // @Patch(':id')
  // updatePayment(
  //   @Param() { id }: IDDto,
  //   @Body() updatePaymentDto: UpdatePaymentDto,
  // ) {
  //   return this.paymentsService.updatePayment({
  //     data: updatePaymentDto,
  //     where: { id },
  //   });
  // }

  @Get()
  getPayments(@Query() query: GetPaymentsPaginationDto) {
    return this.paymentsService.getPayments(query);
  }

  @Get('banks')
  getBankList() {
    return this.paymentsService.getBankList();
  }

  @Get('vnpay-return')
  vnpayReturn(@Query() data) {
    return this.paymentsService.vnpayReturn(data);
  }

  // @Get('options')
  // getPaymentOptions(@Query() query: GetOptionsParams) {
  //   return this.paymentsService.getOptions(query);
  // }

  @Post('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportPayments(@Query() exportPaymentsDto: ExportPaymentsDto) {
    return this.paymentsService.exportPayments(exportPaymentsDto);
  }

  // @Post('import')
  // @ImportExcel()
  // importPayments(@UploadedFile() file: File, @User() user: UserInfo) {
  //   return this.paymentsService.importPayments({ file, user });
  // }

  // @Get(':id')
  // getPayment(@Param() { id }: IDDto) {
  //   return this.paymentsService.getPayment({ id });
  // }

  // @Delete(':id')
  // deletePayment(@Param() { id }: IDDto) {
  //   return this.paymentsService.deletePayment({ id });
  // }
}
