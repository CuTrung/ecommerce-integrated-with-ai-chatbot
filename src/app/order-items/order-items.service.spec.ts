import { AutoMockingModule } from '../../testing/auto-mocking/auto-mocking.module';
import { OrderItemsModule } from './order-items.module';
import { OrderItemsService } from './order-items.service';

describe('OrderItemService', () => {
  let service: OrderItemsService;

  beforeEach(async () => {
    const module = await AutoMockingModule.createTestingModule({
      imports: [OrderItemsModule],
    });

    service = await module.resolve<OrderItemsService>(OrderItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
