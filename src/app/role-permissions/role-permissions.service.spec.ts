import { RolePermissionsService } from './role-permissions.service';
import { RolePermissionsModule } from './role-permissions.module';
import { AutoMockingModule } from '../../testing/auto-mocking/auto-mocking.module';

describe('RolePermissionsService', () => {
  let service: RolePermissionsService;

  beforeEach(async () => {
    const module = await AutoMockingModule.createTestingModule({
      imports: [RolePermissionsModule],
    });

    service = module.get<RolePermissionsService>(RolePermissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
