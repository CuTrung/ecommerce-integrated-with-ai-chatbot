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
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  ExportCategoriesDto,
  GetCategoriesPaginationDto,
} from './dto/get-category.dto';
import { ExcelResponseInterceptor } from '../../common/interceptors/excel-response/excel-response.interceptor';
import { CategoriesService } from './categories.service';
import { User } from '../../common/decorators/user.decorator';
import type { UserInfo } from '../../common/decorators/user.decorator';
import type { Response } from 'express';
import type { File } from '../../common/utils/excel-util/dto/excel-util.interface';
import { GetOptionsParams } from '../../common/query/options.interface';
import { IDDto } from '../../common/dto/param.dto';
import { ImportExcel } from '../../common/utils/excel-util/excel-util.decorator';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  createCategory(@Body() createDto: CreateCategoryDto, @User() user: UserInfo) {
    return this.categoriesService.createCategory({ ...createDto, user });
  }

  @Patch(':id')
  updateCategory(
    @Param() { id }: IDDto,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategory({
      data: updateCategoryDto,
      where: { id },
    });
  }

  @Get()
  getCategories(@Query() query: GetCategoriesPaginationDto) {
    return this.categoriesService.getCategories(query);
  }

  @Get('options')
  getCategoryOptions(@Query() query: GetOptionsParams) {
    return this.categoriesService.getOptions(query);
  }

  @Post('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportCategories(
    @Query() exportCategoriesDto: ExportCategoriesDto,
    @Res() res: Response,
  ) {
    const workbook =
      await this.categoriesService.exportCategories(exportCategoriesDto);
    await workbook.xlsx.write(res);
    res.end();
    return { message: 'Export success' };
  }

  @Post('import')
  @ImportExcel()
  importCategories(@UploadedFile() file: File, @User() user: UserInfo) {
    return this.categoriesService.importCategories({ file, user });
  }

  @Get(':id')
  getCategory(@Param() { id }: IDDto) {
    return this.categoriesService.getCategory({ id });
  }

  @Delete(':id')
  deleteCategory(@Param() { id }: IDDto) {
    return this.categoriesService.deleteCategory({ id });
  }
}
