import {
  Controller,
  Body,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
  Get,
} from '@nestjs/common';
import { ProductCategoriesService } from './product-categories.service';
import { ExportProductCategoriesDto } from './dto/get-product-category.dto';
import { ExcelResponseInterceptor } from '../../common/interceptors/excel-response/excel-response.interceptor';
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
  async exportProductCategories(@Body() params: ExportProductCategoriesDto) {
    return this.productCategoriesService.exportProductCategories(params);
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
