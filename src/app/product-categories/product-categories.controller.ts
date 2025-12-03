import {
  Controller,
  Body,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
  Get,
  Res,
} from '@nestjs/common';
import { ProductCategoriesService } from './product-categories.service';
import { ExportProductCategoriesDto } from './dto/get-product-category.dto';
import { ExcelResponseInterceptor } from '../../common/interceptors/excel-response/excel-response.interceptor';
import type { Response } from 'express';
import { ImportExcel } from '../../common/utils/excel-util/excel-util.decorator';

@Controller('product-categories')
export class ProductCategoriesController {
  constructor(
    private readonly productCategoriesService: ProductCategoriesService,
  ) {}

  @Get()
  getProductCategories() {
    return this.productCategoriesService.getProductCategories();
  }

  @Post('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportProductCategories(
    @Body() params: ExportProductCategoriesDto,
    @Res() res: Response,
  ) {
    const workbook =
      await this.productCategoriesService.exportProductCategories(params);
    await workbook.xlsx.write(res);
    res.end();
    return { message: 'Export success' };
  }

  @Post('import')
  @ImportExcel()
  importProductCategories(@UploadedFile() file, @Req() req) {
    return this.productCategoriesService.importProductCategories({
      file,
      user: req.user,
    });
  }
}
