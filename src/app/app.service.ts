import {
  BeforeApplicationShutdown,
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

@Injectable()
export class AppService
  implements
    OnModuleInit,
    OnApplicationBootstrap,
    OnApplicationShutdown,
    BeforeApplicationShutdown,
    OnModuleDestroy
{
  onModuleInit() {}
  onApplicationBootstrap() {}
  onModuleDestroy() {}

  // only work if app.enableShutdownHooks();
  beforeApplicationShutdown(_signal?: string) {}
  onApplicationShutdown(_signal?: string) {}
  health() {
    return 'OK';
  }
}
