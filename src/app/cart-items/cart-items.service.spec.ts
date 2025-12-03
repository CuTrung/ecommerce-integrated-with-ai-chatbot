import { AutoMockingModule } from '../../../test/auto-mocking/auto-mocking.module';
import { CartItemsModule } from './cart-items.module';
import { CartItemsService } from './cart-items.service';

describe('CartItemService', () => {
  let service: CartItemsService;

  beforeEach(async () => {
    const module = await AutoMockingModule.createTestingModule({
      imports: [CartItemsModule],
    });

    service = await module.resolve<CartItemsService>(CartItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
