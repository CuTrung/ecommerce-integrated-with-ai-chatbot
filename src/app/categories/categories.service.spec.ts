import { AutoMockingModule } from '../../../test/auto-mocking/auto-mocking.module';
import { CategoriesModule } from './categories.module';
import { CategoriesService } from './categories.service';

describe('CategoryService', () => {
  let service: CategoriesService;

  beforeEach(async () => {
    const module = await AutoMockingModule.createTestingModule({
      imports: [CategoriesModule],
    });

    service = await module.resolve<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
