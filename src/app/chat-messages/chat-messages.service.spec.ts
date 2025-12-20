import { AutoMockingModule } from '../../../test/auto-mocking/auto-mocking.module';
import { ChatMessagesModule } from './chat-messages.module';
import { ChatMessagesService } from './chat-messages.service';

describe('ChatMessageService', () => {
  let service: ChatMessagesService;

  beforeEach(async () => {
    const module = await AutoMockingModule.createTestingModule({
      imports: [ChatMessagesModule],
    });

    service = await module.resolve<ChatMessagesService>(ChatMessagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
