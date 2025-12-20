import { Controller, Post, Body, Query, Get } from '@nestjs/common';
import { ChatDto } from './dto/create-chat-message.dto';
import { ChatMessagesService } from './chat-messages.service';
import { User } from '../../common/decorators/user.decorator';
import type { UserInfo } from '../../common/decorators/user.decorator';
import { GetChatMessagesDto } from './dto/get-chat-message.dto';

@Controller('chat-messages')
export class ChatMessagesController {
  constructor(private readonly chatMessagesService: ChatMessagesService) {}

  // @Post()
  // createChatMessage(
  //   @Body() createDto: CreateChatMessageDto,
  //   @User() user: UserInfo,
  // ) {
  //   return this.chatMessagesService.createChatMessage({ ...createDto, user });
  // }

  @Get()
  getChatMessages(@Query() query: GetChatMessagesDto, @User() user: UserInfo) {
    return this.chatMessagesService.getChatMessages({
      ...query,
      userID: user.userID,
    });
  }

  @Post('chat')
  async chat(@Body() chatDto: ChatDto, @User() user: UserInfo) {
    return await this.chatMessagesService.chat({ ...chatDto, user });
  }

  // @Get('options')
  // getChatMessageOptions(@Query() query: GetOptionsParams) {
  //   return this.chatMessagesService.getOptions(query);
  // }

  // @Post('export')
  // @UseInterceptors(ExcelResponseInterceptor)
  // async exportChatMessages(
  //   @Query() exportChatMessagesDto: ExportChatMessagesDto,
  //   @Res() res: Response,
  // ) {
  //   const workbook = await this.chatMessagesService.exportChatMessages(
  //     exportChatMessagesDto,
  //   );
  //   await workbook.xlsx.write(res);
  //   res.end();
  //   return { message: 'Export success' };
  // }

  // @Post('import')
  // @ImportExcel()
  // importChatMessages(@UploadedFile() file: File, @User() user: UserInfo) {
  //   return this.chatMessagesService.importChatMessages({ file, user });
  // }

  // @Get(':id')
  // getChatMessage(@Param() { id }: IDDto) {
  //   return this.chatMessagesService.getChatMessage({ id });
  // }

  // @Delete(':id')
  // deleteChatMessage(@Param() { id }: IDDto) {
  //   return this.chatMessagesService.deleteChatMessage({ id });
  // }
}
