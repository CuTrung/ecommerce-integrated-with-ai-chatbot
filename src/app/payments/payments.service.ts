import { Injectable } from '@nestjs/common';
import { CreatePaymentDto, ImportPaymentsDto } from './dto/create-payment.dto';
import {
  ExportPaymentsDto,
  GetPaymentsPaginationDto,
} from './dto/get-payment.dto';
import { PrismaBaseService } from '../../common/services/prisma-base.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ExcelUtilService } from '../../common/utils/excel-util/excel-util.service';
import { Payment } from './entities/payment.entity';
import { PaymentStatus, Prisma } from '@prisma/client';
import {
  GetOptionsParams,
  Options,
} from '../../common/query/options.interface';
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';
import { QueryUtilService } from '../../common/utils/query-util/query-util.service';
import { WithUser } from '../../common/decorators/user.decorator';
import { VnpayService } from 'nestjs-vnpay';
import { ProductCode, VnpLocale, dateFormat } from 'vnpay';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from '../../common/envs/validate.env';
import { DateUtilService } from '../../common/utils/date-util/date-util.service';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { EventsGateway } from '../../events/events.gateway';

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
    private readonly vnpayService: VnpayService,
    private configService: ConfigService,
    private dateUtilService: DateUtilService,
    private readonly eventsGateway: EventsGateway,
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

  private createPaymentUrl({ orderAmount, orderNumber, userIpAddress }) {
    const expireDate = dateFormat(this.dateUtilService.getTomorrow());
    const paymentUrl = this.vnpayService.buildPaymentUrl({
      vnp_Amount: orderAmount,
      vnp_IpAddr: userIpAddress,
      vnp_TxnRef: orderNumber,
      vnp_OrderInfo: `Payment order ${orderNumber}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: `${this.configService.get<string>(EnvVars.APP_URL)}/payments/vnpay-return`,
      vnp_Locale: VnpLocale.VN, // 'vn' hoặc 'en'
      vnp_ExpireDate: expireDate,
    });
    return paymentUrl;
  }

  async createPayment(createPaymentDto: WithUser<CreatePaymentDto>) {
    const { orderNumber, totalAmount, orderID, ...paymentData } =
      createPaymentDto;

    let paymentUrl = '';
    const orderAmount = parseFloat(<string>totalAmount);
    const isZeroOrder = orderAmount <= 0;
    if (!isZeroOrder) {
      paymentUrl = this.createPaymentUrl({
        orderAmount: totalAmount,
        orderNumber,
        userIpAddress: paymentData.user.userIpAddress,
      });
    }

    const data = await this.extended.create({
      data: {
        ...paymentData,
        status: isZeroOrder ? PaymentStatus.completed : PaymentStatus.pending,
        orderID,
      },
    });
    return { ...data, paymentUrl };
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

  async getBankList() {
    const data = await this.vnpayService.getBankList();
    return data;
  }

  async vnpayReturn(data) {
    const payment = await this.extended.findFirst({
      where: {
        order: {
          orderNumber: data.vnp_TxnRef,
        },
      },
    });
    await this.extended.update({
      data: {
        status: PaymentStatus.completed,
        amount: data.vnp_Amount,
        transactionID: data.vnp_TransactionNo,
      },
      where: {
        id: payment?.id,
      },
    });
    return data;
  }
}
