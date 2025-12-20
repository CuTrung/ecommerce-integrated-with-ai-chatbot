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
import { PaginationUtilService } from '../../common/utils/pagination-util/pagination-util.service';
import { QueryUtilService } from '../../common/utils/query-util/query-util.service';
import { WithUser } from '../../common/decorators/user.decorator';
import { AIService } from '../../common/services/ai/ai.service';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { isEmpty, isNil } from 'es-toolkit/compat';
import { USER_AI_MODEL_EMAIL } from '../../common/services/ai/consts/ai.const';

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
    private paginationUtilService: PaginationUtilService,
    private queryUtilService: QueryUtilService,
    private readonly aiService: AIService,
    private usersService: UsersService,
    private productsService: ProductsService,
  ) {
    super(prismaService, 'chatMessage');
  }

  get client() {
    return super.client;
  }

  get extended() {
    return super.extended;
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

  async createChatMessage(
    createChatMessageDto: WithUser<CreateChatMessageDto>,
  ) {
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

  private async searchByIntent(intent: string, keywords: string[]) {
    switch (intent) {
      case 'BEST_PRICE':
        return this.searchBestPrice();
      case 'PRICE':
      case 'PRODUCT':
        return this.searchProduct(keywords);

      default:
        return [];
    }
  }

  private async searchBestPrice() {
    const data = await this.productsService.extended.search({
      where: {
        price: { gt: 0 },
      },
    });
    return data;
  }

  private async searchProduct(keywords: string[]) {
    const search: any = keywords.map((k) => ({
      OR: [
        { name: { contains: k, mode: 'insensitive' } },
        { description: { contains: k, mode: 'insensitive' } },
      ],
    }));
    const data = await this.productsService.extended.search({
      where: { OR: search },
    });
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
      .replace(/[^\p{L}\p{N}\s.,?]/gu, ' ')
      .split(/\s+/)
      .filter((word) => word.length >= 2 && !STOP_WORDS.includes(word));
  }

  private detectIntent(keywords: string[]) {
    const intents = {
      BEST_PRICE: ['giá tốt nhất', 'rẻ nhất', 'ưu đãi tốt', 'mức giá tốt'],
      PRICE: ['giá', 'sale', 'khuyến', 'mãi'],
      SHIPPING: ['ship', 'vận', 'chuyển'],
    };
    const question = keywords.join(' ').toLowerCase();
    for (const intent of Object.keys(intents)) {
      const matchQuestion = intents[intent].some((k) => question.includes(k));
      if (matchQuestion) return intent;

      if (keywords.some((k) => intents[intent].includes(k))) {
        return intent;
      }
    }

    return 'PRODUCT';
  }

  private buildContext(intent: string, data: any): string {
    if (!data.length) return '';

    if (['PRODUCT', 'PRICE', 'BEST_PRICE'].includes(intent)) {
      const keys = Object.keys(data[0]);

      const context = data.map((item) => {
        return keys
          .reduce<string[]>((acc, key) => {
            const value = item[key];
            if (!isNil(value)) {
              acc.push(`${key}: ${value}`);
            }
            return acc;
          }, [])
          .join('\n');
      });

      return context.join('\n---\n');
    }

    return data.join('\n---\n');
  }

  async buildChatContext(question: string) {
    const keywords = this.extractKeywords(question);
    if (keywords.length === 0) return '';

    const intent = this.detectIntent(keywords);

    const data = await this.searchByIntent(intent, keywords);

    const context = this.buildContext(intent, data);
    return context;
  }

  async chat({ user, question, sessionID }: WithUser<ChatDto>) {
    const userModel = await this.usersService.getUser({
      email: USER_AI_MODEL_EMAIL,
    });
    if (isEmpty(userModel)) throw new Error('AI Model user not create yet!');

    const context = await this.buildChatContext(question);

    const historyMessages = await this.getLastMessages({
      userID: user.userID,
      sessionID,
    });

    const userMessageCreate = {
      user,
      message: question,
      parentID: historyMessages[0]?.child?.id,
      sessionID,
      context,
    };
    const userMessageQuestion = await this.createChatMessage(userMessageCreate);

    const userModelEmail = userModel.email;
    const chatHistory = historyMessages.reduceRight<any>((acc, message) => {
      acc.push({
        role: message.createdBy === userModelEmail ? 'model' : 'user',
        parts: [{ text: message.message }],
      });

      acc.push({
        role: message.child?.createdBy === userModelEmail ? 'model' : 'user',
        parts: [{ text: message.child?.message }],
      });
      return acc;
    }, []);

    const answer = await this.aiService.ask({
      context,
      question,
      chatHistory,
    });

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
    };
    await this.createChatMessage(messageModelCreate);

    return answer;
  }
}
