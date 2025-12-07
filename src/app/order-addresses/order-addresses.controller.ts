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
import { CreateOrderAddressDto } from './dto/create-order-address.dto';
import { UpdateOrderAddressDto } from './dto/update-order-address.dto';
import {
  ExportOrderAddressesDto,
  GetOrderAddressesPaginationDto,
} from './dto/get-order-address.dto';
import { ExcelResponseInterceptor } from '../../common/interceptors/excel-response/excel-response.interceptor';
import { OrderAddressesService } from './order-addresses.service';
import { User } from '../../common/decorators/user.decorator';
import type { UserInfo } from '../../common/decorators/user.decorator';
import type { Response } from 'express';
import type { File } from '../../common/utils/excel-util/dto/excel-util.interface';
import { GetOptionsParams } from '../../common/query/options.interface';
import { IDDto } from '../../common/dto/param.dto';
import { ImportExcel } from '../../common/utils/excel-util/excel-util.decorator';

@Controller('order-addresses')
export class OrderAddressesController {
  constructor(private readonly orderAddressesService: OrderAddressesService) {}

  @Post()
  createOrderAddress(
    @Body() createDto: CreateOrderAddressDto,
    @User() user: UserInfo,
  ) {
    return this.orderAddressesService.createOrderAddress({
      ...createDto,
      user,
    });
  }

  @Patch(':id')
  updateOrderAddress(
    @Param() { id }: IDDto,
    @Body() updateOrderAddressDto: UpdateOrderAddressDto,
  ) {
    return this.orderAddressesService.updateOrderAddress({
      data: updateOrderAddressDto,
      where: { id },
    });
  }

  @Get()
  getOrderAddresses(@Query() query: GetOrderAddressesPaginationDto) {
    return this.orderAddressesService.getOrderAddresses(query);
  }

  @Get('options')
  getOrderAddressOptions(@Query() query: GetOptionsParams) {
    return this.orderAddressesService.getOptions(query);
  }

  @Post('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportOrderAddresses(
    @Query() exportOrderAddressesDto: ExportOrderAddressesDto,
    @Res() res: Response,
  ) {
    const workbook = await this.orderAddressesService.exportOrderAddresses(
      exportOrderAddressesDto,
    );
    await workbook.xlsx.write(res);
    res.end();
    return { message: 'Export success' };
  }

  @Post('import')
  @ImportExcel()
  importOrderAddresses(@UploadedFile() file: File, @User() user: UserInfo) {
    return this.orderAddressesService.importOrderAddresses({ file, user });
  }

  @Get(':id')
  getOrderAddress(@Param() { id }: IDDto) {
    return this.orderAddressesService.getOrderAddress({ id });
  }

  @Delete(':id')
  deleteOrderAddress(@Param() { id }: IDDto) {
    return this.orderAddressesService.deleteOrderAddress({ id });
  }
}
