import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ExcelUtilService } from '../../common/utils/excel-util/excel-util.service';
import {
  CreateProductImageDto,
  ImportProductImagesDto,
} from './dto/create-product-images.dto';
import { ExportProductImagesDto } from './dto/get-product-images.dto';
import { ProductImage } from './entities/product-images.entity';
import { UpdateProductImageDto } from './dto/update-product-images.dto';
import { UploadProductImagesDto } from './dto/create-product-images.dto';
import { UploadApiResponse } from 'cloudinary';
import { FileUtilService } from '../../common/utils/file-util/file-util.service';
import { PrismaBaseService } from '../../common/services/prisma-base.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { WithUser } from '../../common/decorators/user.decorator';
import { QueryUtilService } from '../../common/utils/query-util/query-util.service';
import { LazyModuleLoader } from '@nestjs/core';
import { FileUtilModule } from '../../common/utils/file-util/file-util.module';

@Injectable()
export class ProductImagesService extends PrismaBaseService<'productImage'> {
  private productImageEntityName = ProductImage.name;
  private excelSheets = {
    [this.productImageEntityName]: this.productImageEntityName,
  };
  constructor(
    public prismaService: PrismaService,
    private excelUtilService: ExcelUtilService,
    private eventEmitter: EventEmitter2,
    private queryUtilService: QueryUtilService,
    private readonly lazyModuleLoader: LazyModuleLoader,
  ) {
    super(prismaService, 'productImage');
  }

  async getFileUtilService() {
    const fileUtilModule = await this.lazyModuleLoader.load(
      () => FileUtilModule,
    );
    const fileUtilService = fileUtilModule.get(FileUtilService);
    return fileUtilService;
  }

  async getProductImage(
    productImageWhereUniqueInput: Prisma.ProductImageWhereInput,
  ) {
    const data = await this.extended.findFirst({
      where: productImageWhereUniqueInput,
    });
    return data;
  }

  async getProductImages(
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.ProductImageWhereUniqueInput;
      where?: Prisma.ProductImageWhereInput;
      orderBy?: Prisma.ProductImageOrderByWithRelationInput;
    } = {},
  ) {
    const { skip, take, cursor, where, orderBy } = params;
    const data = await this.extended.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
    return data;
  }

  async createProductImage(
    createProductImageDto: WithUser<CreateProductImageDto>,
  ) {
    const data = await this.extended.create({
      data: createProductImageDto,
    });
    return data;
  }

  async updateProductImage(params: {
    where: Prisma.ProductImageWhereUniqueInput;
    data: UpdateProductImageDto;
  }) {
    const { where, data: dataUpdate } = params;
    const data = await this.extended.update({
      data: dataUpdate,
      where,
    });
    return data;
  }

  async deleteProductImage(where: Prisma.ProductImageWhereUniqueInput) {
    const data = await this.extended.softDelete(where);
    return data;
  }

  async exportProductImages({ ids, select }: ExportProductImagesDto) {
    const where: Record<string, any> = {};
    if (ids) {
      where.id = { in: ids };
    }
    const fieldsSelect =
      this.queryUtilService.convertFieldsSelectOption<ProductImage>(select);
    const productImages = await this.extended.export({
      select: fieldsSelect,
      where,
    });

    const data = this.excelUtilService.generateExcel({
      worksheets: [
        {
          sheetName: this.excelSheets[this.productImageEntityName],
          data: productImages,
        },
      ],
    });

    return data;
  }

  async importProductImages({ file, user }: ImportProductImagesDto) {
    const productImageSheetName = this.excelSheets[this.productImageEntityName];
    const dataCreated = await this.excelUtilService.read(file);
    const data = await this.extended.createMany({
      data: dataCreated[productImageSheetName].map((item) => ({
        ...item,
        user,
      })),
    });
    return data;
  }

  uploadProductImages({ files, user }: UploadProductImagesDto) {
    const data: ProductImage[] = [];
    for (const file of files) {
      this.eventEmitter.emit('product-images.upload', {
        file,
        user,
      });
    }

    return data;
  }

  @OnEvent('product-images.upload')
  async uploadProductImagesEvent(payload) {
    const { file, user } = payload;
    const fileUtilService = await this.getFileUtilService();
    const fileName = fileUtilService.removeFileExtension(file.originalname);
    const productImageExist = await this.getProductImage({
      name: fileName,
    });
    if (productImageExist) {
      await fileUtilService.removeImage(file);
    }
    const { url, secure_url, display_name, created_at } =
      await fileUtilService.uploadImage<UploadApiResponse>(file);
    const dataUpsert = {
      name: display_name,
      description: display_name,
      imageUrl: secure_url ?? url,
      user,
    };
    const result = await this.extended.upsert({
      create: {
        ...dataUpsert,
        createdAt: created_at,
      },
      update: {
        ...dataUpsert,
      },
      where: {
        id: productImageExist?.id ?? '',
      },
    });
    return result;
  }
}
