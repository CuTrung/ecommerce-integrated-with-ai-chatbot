import { Injectable } from '@nestjs/common';
import { CreatePaymentDto, ImportPaymentsDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import {
  ExportPaymentsDto,
  GetPaymentsPaginationDto,
} from './dto/get-payment.dto';
import { PrismaBaseService } from '../../common/services/prisma-base.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ExcelUtilService } from '../../common/utils/excel-util/excel-util.service';
import { Payment } from './entities/payment.entity';
import { Prisma } from '@prisma/client';
import {
  GetOptionsParams,
  Options,
} from '../../common/query/options.interface';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';
import { QueryUtilService } from '../../common/utils/query-util/query-util.service';
import { WithUser } from '../../common/decorators/user.decorator';

@Injectable()
export class PaymentsService
  extends PrismaBaseService<'payment'>
  implements Options
{
  private paymentEntityName = Payment.name;
  private excelSheets = {
    [this.paymentEntityName]: this.paymentEntityName,
  };
  constructor(
    private excelUtilService: ExcelUtilService,
    public prismaService: PrismaService,
    private paginationUtilService: PaginationUtilService,
    private queryUtilService: QueryUtilService,
  ) {
    super(prismaService, 'payment');
  }

  get client() {
    return super.client;
  }

  get extended() {
    return super.extended;
  }

  async getPayment(where: Prisma.PaymentWhereUniqueInput) {
    const data = await this.extended.findUnique({
      where,
    });
    return data;
  }

  async getPayments({
    page,
    itemPerPage,
    select,
    ...search
  }: GetPaymentsPaginationDto) {
    const totalItems = await this.extended.count();
    const paging = this.paginationUtilService.paging({
      page,
      itemPerPage,
      totalItems,
    });
    const fieldsSelect =
      this.queryUtilService.convertFieldsSelectOption<Payment>(select);
    const searchQuery = this.queryUtilService.buildSearchQuery<Payment>({
      search,
    });
    const list = await this.extended.findMany({
      select: fieldsSelect,
      skip: paging.skip,
      take: paging.itemPerPage,
      where: searchQuery,
    });

    const data = paging.format(list);
    return data;
  }

  async createPayment(createPaymentDto: WithUser<CreatePaymentDto>) {
    const data = await this.extended.create({
      data: createPaymentDto,
    });
    return data;
  }

  async updatePayment(params: {
    where: Prisma.PaymentWhereUniqueInput;
    data: UpdatePaymentDto;
  }) {
    const { where, data: dataUpdate } = params;
    const data = await this.extended.update({
      data: dataUpdate,
      where,
    });
    return data;
  }

  async getOptions(params: GetOptionsParams) {
    const { limit, select, ...search } = params;
    const fieldsSelect =
      this.queryUtilService.convertFieldsSelectOption<Payment>(select);
    const searchQuery = this.queryUtilService.buildSearchQuery<Payment>({
      search,
    });
    const data = await this.extended.findMany({
      select: fieldsSelect,
      take: limit,
      where: searchQuery,
    });
    return data;
  }

  async exportPayments({ ids, select }: ExportPaymentsDto) {
    const where: Record<string, any> = {};
    if (ids) {
      where.id = { in: ids };
    }
    const fieldsSelect =
      this.queryUtilService.convertFieldsSelectOption<Payment>(select);
    const payments = await this.extended.export({
      select: fieldsSelect,
      where,
    });

    const data = this.excelUtilService.generateExcel({
      worksheets: [
        {
          sheetName: this.excelSheets[this.paymentEntityName],
          data: payments,
        },
      ],
    });

    return data;
  }

  async importPayments({ file, user }: ImportPaymentsDto) {
    const paymentSheetName = this.excelSheets[this.paymentEntityName];
    const dataCreated = await this.excelUtilService.read(file);
    const data = await this.extended.createMany({
      data: dataCreated[paymentSheetName].map((item) => ({
        ...item,
        user,
      })),
    });
    return data;
  }

  async deletePayment(where: Prisma.PaymentWhereUniqueInput) {
    const data = await this.extended.softDelete(where);
    return data;
  }
}
