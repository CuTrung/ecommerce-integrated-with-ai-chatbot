import { AutoMockingModule } from '../../testing/auto-mocking/auto-mocking.module';
import { OrdersModule } from './orders.module';
import { OrdersService } from './orders.service';

describe('OrderService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module = await AutoMockingModule.createTestingModule({
      imports: [OrdersModule],
    });

    service = await module.resolve<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
