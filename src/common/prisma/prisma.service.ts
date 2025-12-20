import {
  Injectable,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { omit } from 'es-toolkit';
import { Product } from '../../app/products/entities/product.entity';
import { Vendor } from '../../app/vendors/entities/vendor.entity';
import { Category } from '../../app/categories/entities/category.entity';
import { StringUtilService } from '../utils/string-util/string-util.service';
import { DateUtilService } from '../utils/date-util/date-util.service';
import { isEmpty } from 'es-toolkit/compat';
import { Decimal } from '@prisma/client/runtime/library';
import { ChatMessage } from '../../app/chat-messages/entities/chat-message.entity';
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private _extended: ReturnType<typeof this.initExtended>;

  constructor(
    private _dateUtilService: DateUtilService,
    private stringUtilService: StringUtilService,
  ) {
    super({
      transactionOptions: {
        // This feature is not available on MongoDB, because MongoDB does not support isolation levels.
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 5000,
        timeout: 10000,
      },
    });
    this.initExtended();
  }

  private getCurrentUser(value) {
    return (
      value.user?.userEmail ??
      value.user?.email ??
      value.email ??
      value.userEmail
    );
  }

  private setCreatedBy(value: any): any {
    const isArray = Array.isArray(value);
    if (isArray) {
      const result = value.map((value: Record<string, any>) => {
        const user = this.getCurrentUser(value);
        return { ...value, createdBy: user };
      });
      return result;
    }
    return { ...value, createdBy: this.getCurrentUser(value) };
  }

  private omitData(value: any, excludeFields: string[] = []) {
    const isArray = Array.isArray(value);
    if (isArray) {
      const result = value.map((value: Record<string, any>) =>
        omit(value, excludeFields),
      );
      return result;
    }
    return omit(value, excludeFields);
  }

  private transferDataCreate(value, model?: string) {
    const modelsWithUserID = [ChatMessage.name];
    const dataCreatedBy = this.setCreatedBy(value);
    if (model && modelsWithUserID.includes(model)) {
      dataCreatedBy.userID = dataCreatedBy.user.userID;
    }
    const data: any = this.omitData(dataCreatedBy, ['user', 'id']);
    return data;
  }

  private generateData(data: Record<string, any>, model: string) {
    const modelsGenSlug = [Product.name, Vendor.name, Category.name];
    if (modelsGenSlug.includes(model)) {
      const slug = this.stringUtilService.toSlug(data.name);
      return { ...data, slug };
    }
    return data;
  }
  private parseValue(value) {
    if (isEmpty(value)) return value;
    if (value instanceof Decimal) return value.toNumber();
    return value;
  }

  private convertData(data) {
    if (isEmpty(data)) return data;

    if (Array.isArray(data)) {
      const keys = Object.keys(data[0]);
      const result = data.map((item) => {
        const newItem = {};
        for (const key of keys) {
          newItem[key] = this.parseValue(item[key]);
        }
        return { ...item, ...newItem };
      });
      return result;
    }

    const parsedValue = {};
    for (const key of Object.keys(data)) {
      parsedValue[key] = this.parseValue(data[key]);
    }
    return { ...data, ...parsedValue };
  }

  private readonly JUNCTION_TABLES = [
    'RolePermission',
    'UserVendorRole',
    'ChatMessage',
  ];

  initExtended() {
    const extended = this.$extends({
      query: {
        $allModels: {
          findUnique: async ({ args, query }) => {
            args.where = { ...args.where, deletedAt: null };
            const data = await query(args);
            const convertData = this.convertData(data);
            return convertData;
          },
          findFirst: async ({ args, query }) => {
            args.where = { ...args.where, deletedAt: null };
            const data = await query(args);
            const convertData = this.convertData(data);
            return convertData;
          },
          findMany: async ({ args, query, model }) => {
            if (!this.JUNCTION_TABLES.includes(model) && !args.orderBy) {
              args.where = { ...args.where, deletedAt: null };
              args.orderBy = [{ updatedAt: 'desc' }, { createdAt: 'desc' }];
            }
            const data = await query(args);
            const convertData = this.convertData(data);
            return convertData;
          },
          create: ({ args, query, model }) => {
            const generateData = this.generateData(args.data, model);
            const transferData = this.transferDataCreate(generateData, model);
            args.data = transferData;
            return query(args);
          },
          createMany: ({ args, query, model }) => {
            const generateData = this.generateData(args.data, model);
            const transferData = this.transferDataCreate(generateData);
            args.data = transferData;
            return query(args);
          },
          createManyAndReturn: ({ args, query, model }) => {
            const generateData = this.generateData(args.data, model);
            const transferData = this.transferDataCreate(generateData);
            args.data = transferData;
            return query(args);
          },
          update: ({ args, query }) => {
            return query(args);
          },
          updateMany: ({ args, query }) => {
            return query(args);
          },
          count: ({ args, query }) => {
            args.where = { ...args.where, deletedAt: null };
            return query(args);
          },
          upsert: ({ args, query, model }) => {
            const generateCreateData = this.generateData(args.create, model);
            const transferCreateData =
              this.transferDataCreate(generateCreateData);
            args.create = transferCreateData;

            const generateUpdateData = this.generateData(args.update, model);
            const transferUpdateData =
              this.transferDataCreate(generateUpdateData);
            args.update = transferUpdateData;
            return query(args);
          },
          delete: async ({ args, query, model }) => {
            const record = await extended[model].findUnique({
              where: args.where,
            });
            if (!record) {
              throw new NotFoundException(`${model} not found for delete`);
            }
            return query(args);
          },
        },
      },
      model: {
        $allModels: {
          async export<T>(
            this: T,
            args: Prisma.Args<T, 'findMany'> = {} as any,
          ) {
            const context: any = Prisma.getExtensionContext(this);
            const FIELDS_EXCLUDE = ['id'];
            args.select ??= Object.keys(context.fields).reduce(
              (acc, field) => ({
                ...acc,
                [field]: FIELDS_EXCLUDE.includes(field) ? false : true,
              }),
              {},
            );

            const result = await context.findMany(args);
            return result;
          },
          async softDelete<T>(
            this: T,
            where: Prisma.Args<T, 'deleteMany'>['where'],
          ) {
            const context: any = Prisma.getExtensionContext(this);
            const result = await context.updateMany({
              data: { deletedAt: new Date() },
              where,
            });
            return result;
          },
          async restore<T>(
            this: T,
            where: Prisma.Args<T, 'updateMany'>['where'],
          ) {
            const context: any = Prisma.getExtensionContext(this);
            const result = await context.updateMany({
              data: { deletedAt: null },
              where,
            });
            return result;
          },
          async search<T>(
            this: T,
            args: Prisma.Args<T, 'findMany'> = {} as any,
          ) {
            const context: any = Prisma.getExtensionContext(this);
            const FIELDS_EXCLUDE = [
              'id',
              'createdAt',
              'updatedAt',
              'deletedAt',
              'createdBy',
            ];
            args.select ??= Object.keys(context.fields).reduce(
              (acc, field) => ({
                ...acc,
                [field]:
                  FIELDS_EXCLUDE.includes(field) || field.endsWith('ID')
                    ? false
                    : true,
              }),
              {},
            );

            const result = await context.findMany(args);
            return result;
          },
        },
      },
      // result: {
      //   $allModels: {
      //     createdAt: {
      //       compute: ({ createdAt }) =>
      //         this.dateUtilService.formatDate(createdAt),
      //     },
      //     updatedAt: {
      //       compute: ({ updatedAt }) =>
      //         this.dateUtilService.formatDate(updatedAt),
      //     },
      //   },
      // },
    });
    this._extended = extended;
    return extended;
  }

  get extended() {
    return this._extended;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
