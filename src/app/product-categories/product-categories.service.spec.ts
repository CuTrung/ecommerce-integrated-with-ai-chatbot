import { ProductCategoriesService } from './product-categories.service';
import { ProductCategoriesModule } from './product-categories.module';
import { AutoMockingModule } from '../../testing/auto-mocking/auto-mocking.module';

describe('ProductCategoriesService', () => {
  let service: ProductCategoriesService;

  beforeEach(async () => {
    const module = await AutoMockingModule.createTestingModule({
      imports: [ProductCategoriesModule],
    });

    service = module.get<ProductCategoriesService>(ProductCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
