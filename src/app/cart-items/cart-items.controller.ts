import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  Param,
  UseInterceptors,
  Patch,
} from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import {
  ExportCartItemsDto,
  GetCartItemsPaginationDto,
} from './dto/get-cart-item.dto';
import { ExcelResponseInterceptor } from '../../common/interceptors/excel-response/excel-response.interceptor';
import { CartItemsService } from './cart-items.service';
import { User } from '../../common/decorators/user.decorator';
import type { UserInfo } from '../../common/decorators/user.decorator';
import { IDDto } from '../../common/dto/param.dto';

@Controller('cart-items')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @Post()
  createCartItem(@Body() createDto: CreateCartItemDto, @User() user: UserInfo) {
    return this.cartItemsService.createCartItem({ ...createDto, user });
  }

  @Patch(':id')
  updateCartItem(
    @Param() { id }: IDDto,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartItemsService.updateCartItem({
      data: updateCartItemDto,
      where: { id },
    });
  }

  @Get()
  getCartItems(@Query() query: GetCartItemsPaginationDto) {
    return this.cartItemsService.getCartItems(query);
  }

  // @Get('options')
  // getCartItemOptions(@Query() query: GetOptionsParams) {
  //   return this.cartItemsService.getOptions(query);
  // }

  @Post('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportCartItems(@Query() exportCartItemsDto: ExportCartItemsDto) {
    return this.cartItemsService.exportCartItems(exportCartItemsDto);
  }

  // @Post('import')
  // @ImportExcel()
  // importCartItems(@UploadedFile() file: File, @User() user: UserInfo) {
  //   return this.cartItemsService.importCartItems({ file, user });
  // }

  @Get(':id')
  getCartItem(@Param() { id }: IDDto) {
    return this.cartItemsService.getCartItem({ id });
  }

  @Delete(':id')
  deleteCartItem(@Param() { id }: IDDto) {
    return this.cartItemsService.deleteCartItem({ id });
  }
}
