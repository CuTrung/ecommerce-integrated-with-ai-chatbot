import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UsePipes,
  Query,
  Param,
  UseInterceptors,
  UploadedFile,
  Patch,
  Res,
} from '@nestjs/common';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import {
  ExportProductVariantsDto,
  GetProductVariantsPaginationDto,
} from './dto/get-product-variant.dto';
import { ExcelResponseInterceptor } from '../../common/interceptors/excel-response/excel-response.interceptor';
import { ProductVariantsService } from './product-variants.service';
import { User } from '../../common/decorators/user.decorator';
import type { UserInfo } from '../../common/decorators/user.decorator';
import type { Response } from 'express';
import type { File } from '../../common/utils/excel-util/dto/excel-util.interface';
import { GetOptionsParams } from '../../common/query/options.interface';
import { ParseParamsPaginationPipe } from '../../common/pipes/parse-params-pagination.pipe';
import { IDDto } from '../../common/dto/param.dto';
import { ImportExcel } from '../../common/utils/excel-util/excel-util.decorator';

@Controller('product-variants')
export class ProductVariantsController {
  constructor(
    private readonly productVariantsService: ProductVariantsService,
  ) {}

  @Post()
  createProductVariant(
    @Body() createDto: CreateProductVariantDto,
    @User() user: UserInfo,
  ) {
    return this.productVariantsService.createProductVariant({
      ...createDto,
      user,
    });
  }

  @Patch(':id')
  updateProductVariant(
    @Param() { id }: IDDto,
    @Body() updateProductVariantDto: UpdateProductVariantDto,
  ) {
    return this.productVariantsService.updateProductVariant({
      data: updateProductVariantDto,
      where: { id },
    });
  }

  @Get()
  @UsePipes(ParseParamsPaginationPipe)
  getProductVariants(@Query() query: GetProductVariantsPaginationDto) {
    return this.productVariantsService.getProductVariants(query);
  }

  @Get('options')
  getProductVariantOptions(@Query() query: GetOptionsParams) {
    return this.productVariantsService.getOptions(query);
  }

  @Post('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportProductVariants(
    @Query() exportProductVariantsDto: ExportProductVariantsDto,
    @Res() res: Response,
  ) {
    const workbook = await this.productVariantsService.exportProductVariants(
      exportProductVariantsDto,
    );
    await workbook.xlsx.write(res);
    res.end();
    return { message: 'Export success' };
  }

  @Post('import')
  @ImportExcel()
  importProductVariants(@UploadedFile() file: File, @User() user: UserInfo) {
    return this.productVariantsService.importProductVariants({ file, user });
  }

  @Get(':id')
  getProductVariant(@Param() { id }: IDDto) {
    return this.productVariantsService.getProductVariant({ id });
  }

  @Delete(':id')
  deleteProductVariant(@Param() { id }: IDDto) {
    return this.productVariantsService.deleteProductVariant({ id });
  }
}
