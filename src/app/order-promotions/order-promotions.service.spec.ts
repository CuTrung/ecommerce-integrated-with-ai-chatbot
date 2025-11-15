import { OrderPromotionsService } from './order-promotions.service';
import { OrderPromotionsModule } from './order-promotions.module';
import { AutoMockingModule } from '../../testing/auto-mocking/auto-mocking.module';

describe('OrderPromotionsService', () => {
  let service: OrderPromotionsService;

  beforeEach(async () => {
    const module = await AutoMockingModule.createTestingModule({
      imports: [OrderPromotionsModule],
    });

    service = module.get<OrderPromotionsService>(OrderPromotionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
