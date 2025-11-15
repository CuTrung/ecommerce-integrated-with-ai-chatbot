import { AutoMockingModule } from '../../testing/auto-mocking/auto-mocking.module';
import { PromotionsModule } from './promotions.module';
import { PromotionsService } from './promotions.service';

describe('PromotionService', () => {
  let service: PromotionsService;

  beforeEach(async () => {
    const module = await AutoMockingModule.createTestingModule({
      imports: [PromotionsModule],
    });

    service = await module.resolve<PromotionsService>(PromotionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
