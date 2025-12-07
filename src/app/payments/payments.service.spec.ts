import { AutoMockingModule } from '../../../test/auto-mocking/auto-mocking.module';
import { PaymentsModule } from './payments.module';
import { PaymentsService } from './payments.service';

describe('PaymentService', () => {
  let service: PaymentsService;

  beforeEach(async () => {
    const module = await AutoMockingModule.createTestingModule({
      imports: [PaymentsModule],
    });

    service = await module.resolve<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
