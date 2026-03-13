import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { StringUtilService } from '../../common/utils/string-util/string-util.service';
import { UsersModule } from '../users/users.module';
import { JWTEnvs } from './consts/jwt.const';
import { UserRolesModule } from '../user-roles/user-roles.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    UsersModule,
    UserRolesModule,
    RolesModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>(JWTEnvs.JWT_SECRET),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, StringUtilService],
  exports: [AuthService],
})
export class AuthModule {}
