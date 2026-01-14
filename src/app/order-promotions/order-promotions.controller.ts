import { Controller, Body, UseInterceptors, Get, Post } from '@nestjs/common';
import { OrderPromotionsService } from './order-promotions.service';
import { ExportOrderPromotionsDto } from './dto/get-order-promotion.dto';
import { ExcelResponseInterceptor } from '../../common/interceptors/excel-response/excel-response.interceptor';

@Controller('order-promotions')
export class OrderPromotionsController {
  constructor(
    private readonly orderPromotionsService: OrderPromotionsService,
  ) {}

  @Get()
  getOrderPromotions() {
    return this.orderPromotionsService.getOrderPromotions();
  }

  @Post('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportOrderPromotions(@Body() params: ExportOrderPromotionsDto) {
    return this.orderPromotionsService.exportOrderPromotions(params);
  }
}
