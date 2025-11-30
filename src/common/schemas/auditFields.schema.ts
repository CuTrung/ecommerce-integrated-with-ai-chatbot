import { ZodObject } from 'zod';

// Loại bỏ các trường audit
export const omitAuditFields = <T extends ZodObject<any>>(schema: T) => {
  return schema.omit({
    createdAt: true,
    createdBy: true,
    updatedAt: true,
    updatedBy: true,
    deletedAt: true,
  } as any); // dùng 'as any' để bypass strict type check
};

// Loại bỏ thêm field id
export const omitAuditFieldsCreate = <T extends ZodObject<any>>(schema: T) => {
  return omitAuditFields(schema).omit({
    id: true,
  } as any); // 'as any' giúp TypeScript không complain
};
