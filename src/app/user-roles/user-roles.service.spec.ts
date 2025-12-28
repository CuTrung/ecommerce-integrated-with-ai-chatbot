import { UserRolesService } from './user-roles.service';
import { UserRolesModule } from './user-roles.module';
import { AutoMockingModule } from '../../../test/auto-mocking/auto-mocking.module';

describe('UserRolesService', () => {
  let service: UserRolesService;

  beforeEach(async () => {
    const module = await AutoMockingModule.createTestingModule({
      imports: [UserRolesModule],
    });

    service = module.get<UserRolesService>(UserRolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
