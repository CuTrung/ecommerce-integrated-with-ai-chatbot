import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseInterceptors,
  Patch,
  Res,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ExportOrdersDto, GetOrdersPaginationDto } from './dto/get-order.dto';
import { ExcelResponseInterceptor } from '../../common/interceptors/excel-response/excel-response.interceptor';
import { OrdersService } from './orders.service';
import { User } from '../../common/decorators/user.decorator';
import type { UserInfo } from '../../common/decorators/user.decorator';
import type { Response } from 'express';
import { GetOptionsParams } from '../../common/query/options.interface';
import { IDDto } from '../../common/dto/param.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(@Body() createDto: CreateOrderDto, @User() user: UserInfo) {
    return this.ordersService.createOrder({ ...createDto, user });
  }

  @Patch(':id')
  updateOrder(@Param() { id }: IDDto, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.updateOrder({
      data: updateOrderDto,
      where: { id },
    });
  }

  @Get()
  getOrders(@Query() query: GetOrdersPaginationDto) {
    return this.ordersService.getOrders(query);
  }

  @Get('options')
  getOrderOptions(@Query() query: GetOptionsParams) {
    return this.ordersService.getOptions(query);
  }

  @Post('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportOrders(
    @Query() exportOrdersDto: ExportOrdersDto,
    @Res() res: Response,
  ) {
    const workbook = await this.ordersService.exportOrders(exportOrdersDto);
    await workbook.xlsx.write(res);
    res.end();
    return { message: 'Export success' };
  }

  // @Post('import')
  // @ImportExcel()
  // importOrders(@UploadedFile() file: File, @User() user: UserInfo) {
  //   return this.ordersService.importOrders({ file, user });
  // }

  @Get(':id')
  getOrder(@Param() { id }: IDDto) {
    return this.ordersService.getOrder({ id });
  }

  // @Delete(':id')
  // deleteOrder(@Param() { id }: IDDto) {
  //   return this.ordersService.deleteOrder({ id });
  // }
}
