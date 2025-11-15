import { AutoMockingModule } from '../../testing/auto-mocking/auto-mocking.module';
import { ProductVariantsModule } from './product-variants.module';
import { ProductVariantsService } from './product-variants.service';

describe('ProductVariantService', () => {
  let service: ProductVariantsService;

  beforeEach(async () => {
    const module = await AutoMockingModule.createTestingModule({
      imports: [ProductVariantsModule],
    });

    service = await module.resolve<ProductVariantsService>(
      ProductVariantsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
