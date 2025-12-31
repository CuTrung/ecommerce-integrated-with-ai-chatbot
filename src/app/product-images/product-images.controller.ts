import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Query,
  Res,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import { ProductImagesService } from './product-images.service';
import { CreateProductImageDto } from './dto/create-product-images.dto';
import { UpdateProductImageDto } from './dto/update-product-images.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ExportProductImagesDto,
  GetProductImagesPaginationDto,
} from './dto/get-product-images.dto';
import type { File } from '../../common/utils/excel-util/dto/excel-util.interface';
import type { Response } from 'express';
import { ExcelResponseInterceptor } from '../../common/interceptors/excel-response/excel-response.interceptor';
import { User } from '../../common/decorators/user.decorator';
import type { UserInfo } from '../../common/decorators/user.decorator';
import { IDDto } from '../../common/dto/param.dto';
import { ImportExcel } from '../../common/utils/excel-util/excel-util.decorator';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('product-images')
export class ProductImagesController {
  constructor(private readonly productImagesService: ProductImagesService) {}

  @Post()
  createProductImage(
    @Body() createProductImageDto: CreateProductImageDto,
    @User() user: UserInfo,
  ) {
    return this.productImagesService.createProductImage({
      ...createProductImageDto,
      user,
    });
  }

  @Post('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportProductImages(
    @Query() exportProductImagesDto: ExportProductImagesDto,
    @Res() res: Response,
  ) {
    const workbook = await this.productImagesService.exportProductImages(
      exportProductImagesDto,
    );
    await workbook.xlsx.write(res);
    res.end();
    return { message: 'Export productImages success' };
  }

  @Post('import')
  @ImportExcel()
  importProductImages(@UploadedFile() file: File, @User() user: UserInfo) {
    return this.productImagesService.importProductImages({
      file,
      user,
    });
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files'))
  uploadProductImages(@UploadedFiles() files: File[], @User() user: UserInfo) {
    return this.productImagesService.uploadProductImages({
      files,
      user,
    });
  }

  @Get()
  getProductImages(@Query() query: GetProductImagesPaginationDto) {
    return this.productImagesService.getProductImages(query);
  }

  @Get(':id')
  getProductImage(@Param() { id }: IDDto) {
    return this.productImagesService.getProductImage({ id });
  }

  @Patch(':id')
  updateProductImage(
    @Param() { id }: IDDto,
    @Body() updateProductImageDto: UpdateProductImageDto,
  ) {
    return this.productImagesService.updateProductImage({
      data: updateProductImageDto,
      where: { id },
    });
  }

  @Delete(':id')
  deleteProductImage(@Param() { id }: IDDto) {
    return this.productImagesService.deleteProductImage({ id });
  }
}
