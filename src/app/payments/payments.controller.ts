import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  Param,
  UseInterceptors,
  UploadedFile,
  Patch,
  Res,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import {
  ExportPaymentsDto,
  GetPaymentsPaginationDto,
} from './dto/get-payment.dto';
import { ExcelResponseInterceptor } from '../../common/interceptors/excel-response/excel-response.interceptor';
import { PaymentsService } from './payments.service';
import { User } from '../../common/decorators/user.decorator';
import type { UserInfo } from '../../common/decorators/user.decorator';
import type { Response } from 'express';
import type { File } from '../../common/utils/excel-util/dto/excel-util.interface';
import { GetOptionsParams } from '../../common/query/options.interface';
import { IDDto } from '../../common/dto/param.dto';
import { ImportExcel } from '../../common/utils/excel-util/excel-util.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  createPayment(@Body() createDto: CreatePaymentDto, @User() user: UserInfo) {
    return this.paymentsService.createPayment({ ...createDto, user });
  }

  @Patch(':id')
  updatePayment(
    @Param() { id }: IDDto,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.paymentsService.updatePayment({
      data: updatePaymentDto,
      where: { id },
    });
  }

  @Get()
  getPayments(@Query() query: GetPaymentsPaginationDto) {
    return this.paymentsService.getPayments(query);
  }

  @Get('options')
  getPaymentOptions(@Query() query: GetOptionsParams) {
    return this.paymentsService.getOptions(query);
  }

  @Post('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportPayments(
    @Query() exportPaymentsDto: ExportPaymentsDto,
    @Res() res: Response,
  ) {
    const workbook =
      await this.paymentsService.exportPayments(exportPaymentsDto);
    await workbook.xlsx.write(res);
    res.end();
    return { message: 'Export success' };
  }

  @Post('import')
  @ImportExcel()
  importPayments(@UploadedFile() file: File, @User() user: UserInfo) {
    return this.paymentsService.importPayments({ file, user });
  }

  @Get(':id')
  getPayment(@Param() { id }: IDDto) {
    return this.paymentsService.getPayment({ id });
  }

  @Delete(':id')
  deletePayment(@Param() { id }: IDDto) {
    return this.paymentsService.deletePayment({ id });
  }
}
