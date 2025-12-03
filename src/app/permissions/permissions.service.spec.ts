import { AutoMockingModule } from '../../../test/auto-mocking/auto-mocking.module';
import { PermissionsModule } from './permissions.module';
import { PermissionsService } from './permissions.service';

describe('PermissionService', () => {
  let service: PermissionsService;

  beforeEach(async () => {
    const module = await AutoMockingModule.createTestingModule({
      imports: [PermissionsModule],
    });

    service = await module.resolve<PermissionsService>(PermissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
