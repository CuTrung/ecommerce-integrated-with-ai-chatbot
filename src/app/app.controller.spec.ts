import { TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AutoMockingModule } from '../../test/auto-mocking/auto-mocking.module';
import { AppModule } from './app.module';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await AutoMockingModule.createTestingModule({
      imports: [AppModule],
    });

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "OK"', () => {
      expect(appController.health()).toBe('OK');
    });
  });
});
