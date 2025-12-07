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
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import {
  ExportOrderItemsDto,
  GetOrderItemsPaginationDto,
} from './dto/get-order-item.dto';
import { ExcelResponseInterceptor } from '../../common/interceptors/excel-response/excel-response.interceptor';
import { OrderItemsService } from './order-items.service';
import { User } from '../../common/decorators/user.decorator';
import type { UserInfo } from '../../common/decorators/user.decorator';
import type { Response } from 'express';
import type { File } from '../../common/utils/excel-util/dto/excel-util.interface';
import { GetOptionsParams } from '../../common/query/options.interface';
import { IDDto } from '../../common/dto/param.dto';
import { ImportExcel } from '../../common/utils/excel-util/excel-util.decorator';

@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Post()
  createOrderItem(
    @Body() createDto: CreateOrderItemDto,
    @User() user: UserInfo,
  ) {
    return this.orderItemsService.createOrderItem({ ...createDto, user });
  }

  @Patch(':id')
  updateOrderItem(
    @Param() { id }: IDDto,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
  ) {
    return this.orderItemsService.updateOrderItem({
      data: updateOrderItemDto,
      where: { id },
    });
  }

  @Get()
  getOrderItems(@Query() query: GetOrderItemsPaginationDto) {
    return this.orderItemsService.getOrderItems(query);
  }

  @Get('options')
  getOrderItemOptions(@Query() query: GetOptionsParams) {
    return this.orderItemsService.getOptions(query);
  }

  @Post('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportOrderItems(
    @Query() exportOrderItemsDto: ExportOrderItemsDto,
    @Res() res: Response,
  ) {
    const workbook =
      await this.orderItemsService.exportOrderItems(exportOrderItemsDto);
    await workbook.xlsx.write(res);
    res.end();
    return { message: 'Export success' };
  }

  @Post('import')
  @ImportExcel()
  importOrderItems(@UploadedFile() file: File, @User() user: UserInfo) {
    return this.orderItemsService.importOrderItems({ file, user });
  }

  @Get(':id')
  getOrderItem(@Param() { id }: IDDto) {
    return this.orderItemsService.getOrderItem({ id });
  }

  @Delete(':id')
  deleteOrderItem(@Param() { id }: IDDto) {
    return this.orderItemsService.deleteOrderItem({ id });
  }
}
