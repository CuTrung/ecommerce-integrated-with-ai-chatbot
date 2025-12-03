import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { Category } from '../../categories/entities/category.entity';
import { Product } from '../../products/entities/product.entity';

export class ExportProductCategoriesDto extends createZodDto(
  z.object({
    productIDs: z.array(z.string().uuid()).optional().nullish().default(null),
    categoryIDs: z.array(z.string().uuid()).optional().nullish().default(null),
  }),
) {}

export type ProductsData = Pick<Product, 'id' | 'name'>[];
export type ProductsImportCreate = Pick<
  Product,
  'name' | 'vendorID' | 'slug' | 'price'
>[];

export type CategoriesData = Pick<Category, 'id' | 'name'>[];
export type CategoriesImportCreate = Pick<Category, 'name' | 'slug'>[];
