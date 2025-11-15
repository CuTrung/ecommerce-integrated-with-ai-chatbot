import { AutoMockingModule } from '../../testing/auto-mocking/auto-mocking.module';
import { ProductsModule } from './products.module';
import { ProductsService } from './products.service';

describe('ProductService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module = await AutoMockingModule.createTestingModule({
      imports: [ProductsModule],
    });

    service = await module.resolve<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
