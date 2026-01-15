import { Injectable } from '@nestjs/common';
import {
  ChatDto,
  CreateChatMessageDto,
  ImportChatMessagesDto,
} from './dto/create-chat-message.dto';
import {
  ExportChatMessagesDto,
  GetChatMessagesDto,
  GetLastMessagesDto,
} from './dto/get-chat-message.dto';
import { PrismaBaseService } from '../../common/services/prisma-base.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ExcelUtilService } from '../../common/utils/excel-util/excel-util.service';
import { ChatMessage } from './entities/chat-message.entity';
import { Prisma } from '@prisma/client';
import {
  GetOptionsParams,
  Options,
} from '../../common/query/options.interface';
import { QueryUtilService } from '../../common/utils/query-util/query-util.service';
import { WithUser } from '../../common/decorators/user.decorator';
import { AIService } from '../../common/services/ai/ai.service';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import {
  capitalize,
  isArray,
  isEmpty,
  isNil,
  isNumber,
  isObject,
} from 'es-toolkit/compat';
import { OrdersService } from '../orders/orders.service';
import { LazyModuleLoader } from '@nestjs/core';
import { AIModule } from '../../common/services/ai/ai.module';
import { Intents } from './consts/intents.const';
import { AI_MODEL_USER_EMAIL } from '../../common/services/ai/consts/ai.const';
import { ProductVariantsService } from '../product-variants/product-variants.service';

@Injectable()
export class ChatMessagesService
  extends PrismaBaseService<'chatMessage'>
  implements Options
{
  private chatMessageEntityName = ChatMessage.name;
  private excelSheets = {
    [this.chatMessageEntityName]: this.chatMessageEntityName,
  };

  constructor(
    private excelUtilService: ExcelUtilService,
    public prismaService: PrismaService,
    private queryUtilService: QueryUtilService,
    private usersService: UsersService,
    private productsService: ProductsService,
    private ordersService: OrdersService,
    private readonly lazyModuleLoader: LazyModuleLoader,
    private productVariantsService: ProductVariantsService,
  ) {
    super(prismaService, 'chatMessage');
  }

  get client() {
    return super.client;
  }

  get extended() {
    return super.extended;
  }

  async getAIService() {
    const aiModule = await this.lazyModuleLoader.load(() => AIModule);
    const aiService = aiModule.get(AIService);
    return aiService;
  }

  async getChatMessage(where: Prisma.ChatMessageWhereUniqueInput) {
    const data = await this.extended.findUnique({
      where,
    });
    return data;
  }

  async getChatMessages({ select, userID, ...search }: GetChatMessagesDto) {
    const fieldsSelect =
      this.queryUtilService.convertFieldsSelectOption<ChatMessage>(select);
    const searchQuery = this.queryUtilService.buildSearchQuery<ChatMessage>({
      search,
    });
    const list = await this.extended.findMany({
      select: fieldsSelect,
      orderBy: { createdAt: 'asc' },
      where: { ...searchQuery, userID },
      include: { child: true },
    });

    return list;
  }

  async createChatMessage(createChatMessageDto: CreateChatMessageDto) {
    const data = await this.extended.create({
      data: createChatMessageDto,
    });
    return data;
  }

  async getOptions(params: GetOptionsParams) {
    const { limit, select, ...search } = params;
    const fieldsSelect =
      this.queryUtilService.convertFieldsSelectOption<ChatMessage>(select);
    const searchQuery = this.queryUtilService.buildSearchQuery<ChatMessage>({
      search,
    });
    const data = await this.extended.findMany({
      select: fieldsSelect,
      take: limit,
      where: searchQuery,
    });
    return data;
  }

  async exportChatMessages({ ids, select }: ExportChatMessagesDto) {
    const where: Record<string, any> = {};
    if (ids) {
      where.id = { in: ids };
    }
    const fieldsSelect =
      this.queryUtilService.convertFieldsSelectOption<ChatMessage>(select);
    const chatMessages = await this.extended.export({
      select: fieldsSelect,
      where,
    });

    const data = this.excelUtilService.generateExcel({
      worksheets: [
        {
          sheetName: this.excelSheets[this.chatMessageEntityName],
          data: chatMessages,
        },
      ],
    });

    return data;
  }

  async importChatMessages({ file, user }: ImportChatMessagesDto) {
    const chatMessageSheetName = this.excelSheets[this.chatMessageEntityName];
    const dataCreated = await this.excelUtilService.read(file);
    const data = await this.extended.createMany({
      data: dataCreated[chatMessageSheetName].map((item) => ({
        ...item,
        user,
      })),
    });
    return data;
  }

  async deleteChatMessage(where: Prisma.ChatMessageWhereUniqueInput) {
    const data = await this.extended.softDelete(where);
    return data;
  }

  async getLastMessages({ userID, sessionID, limit = 5 }: GetLastMessagesDto) {
    const data = await this.extended.findMany({
      where: { userID, sessionID },
      orderBy: { createdAt: 'desc' },
      include: { child: true },
      take: limit,
    });
    return data;
  }

  private async searchBestPrice() {
    const data = await this.productVariantsService.extended.search({
      where: {
        price: { gte: 0 },
      },
    });
    return data;
  }

  private async searchProductVariant(keywords: string[]) {
    const question = keywords.join(' ');
    const search: any = keywords.map((k) => ({
      OR: [{ name: { contains: k, mode: 'insensitive' } }],
    }));

    let data = await this.productVariantsService.extended.search({
      where: { OR: search },
    });

    const isSearchAll =
      ['bán chạy', 'nhiều', 'mua', 'danh sách', 'tất cả'].some((item) =>
        question.includes(item),
      ) || data.length === 0;
    if (isSearchAll) {
      data = await this.productVariantsService.extended.search({});
    }

    return data;
  }

  private async searchOrder(keywords: string[]) {
    const question = keywords.join(' ');
    const search: any = keywords.map((k) => ({
      OR: [
        { orderNumber: { contains: k, mode: 'insensitive' } },
        // { status: { contains: k, mode: 'insensitive' } },
        {
          orderAddresses: {
            some: { fullAddress: { contains: k, mode: 'insensitive' } },
          },
        },
      ],
    }));
    let data = await this.ordersService.extended.search({
      where: { OR: search },
    });

    const isSearchAll =
      ['bán chạy', 'nhiều', 'mua nhiều', 'danh sách', 'tất cả'].some((item) =>
        question.includes(item),
      ) || data.length === 0;
    if (isSearchAll) {
      data = await this.ordersService.extended.search({
        select: {
          orderItems: {
            select: {
              productVariant: {
                select: {
                  product: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    }

    return data;
  }

  private extractKeywords(question: string): string[] {
    const STOP_WORDS = [
      // đại từ
      'tôi',
      'mình',
      'em',
      'anh',
      'chị',
      'bạn',
      'shop',

      // trợ từ – liên từ
      'là',
      'thì',
      'mà',
      'hay',
      'hoặc',
      'không',
      'chưa',
      'nhỉ',

      // động từ phụ
      'muốn',
      'cần',
      'được',
      'bị',

      // từ lịch sự
      'ơi',
      'ạ',
      'nhé',
      'với',
      'giúp',
      'nhé',

      // từ hỏi chung
      'gì',
      'sao',
      'nào',
      'thế',
      'đâu',

      // tiếng anh giao tiếp
      'please',
      'pls',
      'help',
    ];

    return question
      .toLowerCase()
      .normalize('NFC')
      .replace(/[^\p{L}\p{N}\s.,]/gu, ' ')
      .split(/\s+/)
      .filter((word) => {
        const parseWord = parseFloat(word);
        if (isNumber(parseWord) && !isNaN(parseWord)) return true;
        return word.length >= 2 && !STOP_WORDS.includes(word);
      });
  }

  private detectIntent(keywords: string[]) {
    const intents = {
      [Intents.BEST_PRICE]: [
        'giá tốt nhất',
        'rẻ nhất',
        'ưu đãi tốt',
        'mức giá tốt',
      ],
      [Intents.PRICE]: ['giá', 'sale', 'khuyến', 'mãi'],
      [Intents.SHIPPING]: ['ship', 'vận', 'chuyển'],
      [Intents.PRODUCT_VARIANT]: ['sản', 'phẩm', 'product'],
      [Intents.ORDER]: [
        'đặt',
        'hàng',
        'đơn',
        'order',
        'đơn hàng',
        'thanh toán',
        'bán chạy',
        'nhiều',
        'mua nhiều',
      ],
    };
    const question = keywords.join(' ').toLowerCase();
    const keys = Object.keys(intents) as Intents[];
    for (const intent of keys) {
      const matchQuestion = intents[intent].some((k) => question.includes(k));
      if (matchQuestion) return intent;

      if (keywords.some((k) => intents[intent].includes(k))) {
        return intent;
      }
    }

    return Intents.PRODUCT_VARIANT;
  }

  private async searchByIntent(intent: Intents, keywords: string[]) {
    switch (intent) {
      case Intents.BEST_PRICE:
        return this.searchBestPrice();
      case Intents.PRICE:
      case Intents.PRODUCT_VARIANT:
        return this.searchProductVariant(keywords);
      case Intents.ORDER:
      case Intents.SHIPPING:
        return this.searchOrder(keywords);

      default:
        return [];
    }
  }

  private buildContext(intent: string, data: any): string {
    if (!data.length) return '';

    const keys = Object.keys(data[0]);
    const context = data.map((item) => {
      return keys
        .reduce<string[]>((acc, key) => {
          const value = item[key];
          if (isObject(value) || isArray(value)) {
            acc.push(JSON.stringify(value));
          } else if (!isNil(value)) {
            acc.push(`${key}: ${value}`);
          }

          return acc;
        }, [])
        .join('\n');
    });

    return context.join('\n---\n');
  }

  async buildChatContext(question: string) {
    const keywords = this.extractKeywords(question);

    const intent = this.detectIntent(keywords);

    const data = await this.searchByIntent(intent, keywords);

    const context = this.buildContext(intent, data);
    return { context, intent };
  }

  async chat({ user, question, sessionID }: WithUser<ChatDto>) {
    const userModel = await this.usersService.getUser({
      email: AI_MODEL_USER_EMAIL,
    });
    if (isEmpty(userModel)) throw new Error('AI Model user not create yet!');

    if (isEmpty(question)) throw new Error('Question is required!');

    const { context, intent } = await this.buildChatContext(question);

    const historyMessages = await this.getLastMessages({
      userID: user.userID,
      sessionID,
    });
    const userModelEmail = userModel.email;
    const chatHistory = historyMessages.reduceRight<any>((acc, message) => {
      acc.push({
        role: message.createdBy === userModelEmail ? 'model' : 'user',
        parts: [{ text: message.message }],
      });

      const messageChild = message.child?.message;
      if (messageChild) {
        acc.push({
          role: message.child?.createdBy === userModelEmail ? 'model' : 'user',
          parts: [{ text: messageChild }],
        });
      }

      return acc;
    }, []);

    const userMessageCreate = {
      user,
      message: question,
      parentID: historyMessages[0]?.child?.id,
      sessionID,
      context,
      userID: user.userID,
    };
    const userMessageQuestion = await this.createChatMessage(userMessageCreate);

    const aiService = await this.getAIService();
    let answer = await aiService.ask({
      context,
      question,
      chatHistory,
    });

    const isExportExcel = ['xuất', 'excel'].some((word) =>
      question.toLowerCase().includes(word),
    );
    if (isExportExcel) {
      const ids = JSON.parse(answer);
      const mappingEntityName = {
        [Intents.BEST_PRICE]: 'product',
        [Intents.PRICE]: 'product',
        [Intents.SHIPPING]: 'order',
      };
      const entityNameRoot = intent.toLowerCase();
      const entityName = `${mappingEntityName[entityNameRoot] ?? entityNameRoot}s`;

      const buffer: Buffer = await this[`${entityName}Service`][
        `export${capitalize(entityName)}`
      ]({
        ids,
        select: null,
      });
      const fileName = await this.excelUtilService.saveExcel(
        buffer,
        entityName,
      );
      answer = `Bạn có thể tải file excel tại đường link sau: ${process.env.APP_URL}/chat-messages/files/exports/${fileName}`;
    }

    const isAutoCreateOrder = ['tạo đơn hàng', 'lên đơn hàng'].some((word) =>
      question.toLowerCase().includes(word),
    );
    if (isAutoCreateOrder) {
      const productVariantIDs = JSON.parse(answer);
      const order = await this.ordersService.createOrderFromChatbot({
        user,
        productVariantIDs,
      });
      answer = `Đơn hàng của bạn đã được tạo thành công với mã đơn hàng: ${order.orderNumber}.`;
    }

    const messageModelCreate = {
      user: {
        userID: userModel?.id,
        userEmail: userModelEmail,
        userIpAddress: user.userIpAddress,
      },
      message: answer,
      sessionID: userMessageQuestion.sessionID,
      parentID: userMessageQuestion.id,
      context: userMessageQuestion.context,
      userID: user.userID,
    };
    await this.createChatMessage(messageModelCreate);

    return answer;
  }
}
