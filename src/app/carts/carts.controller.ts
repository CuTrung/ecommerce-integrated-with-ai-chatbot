import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  Param,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { ExportCartsDto, GetCartsPaginationDto } from './dto/get-cart.dto';
import { ExcelResponseInterceptor } from '../../common/interceptors/excel-response/excel-response.interceptor';
import { CartsService } from './carts.service';
import { User } from '../../common/decorators/user.decorator';
import type { UserInfo } from '../../common/decorators/user.decorator';
import { IDDto } from '../../common/dto/param.dto';
import { isEmpty } from 'es-toolkit/compat';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  createCart(@Body() createDto: CreateCartDto, @User() user: UserInfo) {
    createDto['user'] = user;
    return this.cartsService.createCart(createDto);
  }

  // @Patch(':id')
  // updateCart(@Param() { id }: IDDto, @Body() updateCartDto: UpdateCartDto) {
  //   return this.cartsService.updateCart({
  //     data: updateCartDto,
  //     where: { id },
  //   });
  // }

  @Get()
  getCarts(@Query() query: GetCartsPaginationDto) {
    return this.cartsService.getCarts(query);
  }

  // @Get('options')
  // getCartOptions(@Query() query: GetOptionsParams) {
  //   return this.cartsService.getOptions(query);
  // }

  @Post('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportCarts(@Query() exportCartsDto: ExportCartsDto) {
    return this.cartsService.exportCarts(exportCartsDto);
  }

  // @Post('import')
  // @ImportExcel()
  // importCarts(@UploadedFile() file: File, @User() user: UserInfo) {
  //   return this.cartsService.importCarts({ file, user });
  // }

  @Get(':id')
  getCart(@Param() { id }: IDDto) {
    return this.cartsService.getCart({ id });
  }

  @Delete(':id')
  deleteCart(@Param() { id }: IDDto) {
    const cartDelete = this.getCart({ id });
    if (isEmpty(cartDelete)) throw new BadRequestException('Cart not found!');
    return this.cartsService.deleteCart({ id });
  }
}
