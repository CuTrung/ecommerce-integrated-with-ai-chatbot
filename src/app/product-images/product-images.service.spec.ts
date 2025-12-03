import { TestingModule } from '@nestjs/testing';
import { ProductImagesService } from './product-images.service';
import { AutoMockingModule } from '../../../test/auto-mocking/auto-mocking.module';
import { ProductImagesModule } from './product-images.module';

describe('ProductImagesService', () => {
  let service: ProductImagesService;

  beforeEach(async () => {
    const module: TestingModule = await AutoMockingModule.createTestingModule({
      imports: [ProductImagesModule],
    });

    service = module.get<ProductImagesService>(ProductImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
