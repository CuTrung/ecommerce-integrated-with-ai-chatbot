import { TestingModule } from '@nestjs/testing';
import { ProductImagesController } from './product-images.controller';
import { ProductImagesModule } from './product-images.module';
import { AutoMockingModule } from '../../../test/auto-mocking/auto-mocking.module';

describe('ProductImagesController', () => {
  let controller: ProductImagesController;

  beforeEach(async () => {
    const module: TestingModule = await AutoMockingModule.createTestingModule({
      imports: [ProductImagesModule],
    });

    controller = module.get<ProductImagesController>(ProductImagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
