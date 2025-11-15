import { UserVendorRolesService } from './user-vendor-roles.service';
import { UserVendorRolesModule } from './user-vendor-roles.module';
import { AutoMockingModule } from '../../testing/auto-mocking/auto-mocking.module';

describe('UserVendorRolesService', () => {
  let service: UserVendorRolesService;

  beforeEach(async () => {
    const module = await AutoMockingModule.createTestingModule({
      imports: [UserVendorRolesModule],
    });

    service = module.get<UserVendorRolesService>(UserVendorRolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
