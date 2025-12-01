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
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import {
  ExportVendorsDto,
  GetVendorsPaginationDto,
} from './dto/get-vendor.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelResponseInterceptor } from '../../common/interceptors/excel-response/excel-response.interceptor';
import { VendorsService } from './vendors.service';
import { User } from '../../common/decorators/user.decorator';
import type { UserInfo } from '../../common/decorators/user.decorator';
import type { Response } from 'express';
import type { File } from '../../common/utils/excel-util/dto/excel-util.interface';
import { GetOptionsParams } from '../../common/query/options.interface';
import { ParseParamsPaginationPipe } from '../../common/pipes/parse-params-pagination.pipe';
import { IDDto } from '../../common/dto/param.dto';

@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post()
  createVendor(@Body() createDto: CreateVendorDto, @User() user: UserInfo) {
    return this.vendorsService.createVendor({ ...createDto, user });
  }

  @Patch(':id')
  updateVendor(
    @Param() { id }: IDDto,
    @Body() updateVendorDto: UpdateVendorDto,
  ) {
    return this.vendorsService.updateVendor({
      data: updateVendorDto,
      where: { id },
    });
  }

  @Get()
  @UsePipes(ParseParamsPaginationPipe)
  getVendors(@Query() query: GetVendorsPaginationDto) {
    return this.vendorsService.getVendors(query);
  }

  @Get('options')
  getVendorOptions(@Query() query: GetOptionsParams) {
    return this.vendorsService.getOptions(query);
  }

  @Get('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportVendors(
    @Query() exportVendorsDto: ExportVendorsDto,
    @Res() res: Response,
  ) {
    const workbook = await this.vendorsService.exportVendors(exportVendorsDto);
    await workbook.xlsx.write(res);
    res.end();
    return { message: 'Export success' };
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  importVendors(@UploadedFile() file: File, @User() user: UserInfo) {
    return this.vendorsService.importVendors({ file, user });
  }

  @Get(':id')
  getVendor(@Param() { id }: IDDto) {
    return this.vendorsService.getVendor({ id });
  }

  @Delete(':id')
  deleteVendor(@Param() { id }: IDDto) {
    return this.vendorsService.deleteVendor({ id });
  }
}
