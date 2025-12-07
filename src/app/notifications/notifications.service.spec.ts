import { AutoMockingModule } from '../../../test/auto-mocking/auto-mocking.module';
import { NotificationsModule } from './notifications.module';
import { NotificationsService } from './notifications.service';

describe('NotificationService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const module = await AutoMockingModule.createTestingModule({
      imports: [NotificationsModule],
    });

    service = await module.resolve<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
