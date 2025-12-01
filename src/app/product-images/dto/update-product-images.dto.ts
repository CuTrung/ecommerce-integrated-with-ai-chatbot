import { PartialType } from '@nestjs/swagger';
import { CreateProductImageDto } from './create-product-images.dto';

export class UpdateProductImageDto extends PartialType(CreateProductImageDto) {}
