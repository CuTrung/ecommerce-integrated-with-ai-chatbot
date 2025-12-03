import { AutoMockingModule } from '../../../test/auto-mocking/auto-mocking.module';
import { VendorsModule } from './vendors.module';
import { VendorsService } from './vendors.service';

describe('VendorService', () => {
  let service: VendorsService;

  beforeEach(async () => {
    const module = await AutoMockingModule.createTestingModule({
      imports: [VendorsModule],
    });

    service = await module.resolve<VendorsService>(VendorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
