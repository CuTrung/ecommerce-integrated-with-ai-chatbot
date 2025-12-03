import { AutoMockingModule } from '../../../test/auto-mocking/auto-mocking.module';
import { OrderAddressesModule } from './order-addresses.module';
import { OrderAddressesService } from './order-addresses.service';

describe('OrderAddressService', () => {
  let service: OrderAddressesService;

  beforeEach(async () => {
    const module = await AutoMockingModule.createTestingModule({
      imports: [OrderAddressesModule],
    });

    service = await module.resolve<OrderAddressesService>(
      OrderAddressesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
