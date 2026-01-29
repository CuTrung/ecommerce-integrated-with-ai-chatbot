import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { IS_SKIP_AUTH } from '../../../app/auth/auth.decorator';
import { UsersService } from '../../../app/users/users.service';
import { User } from '../../../app/users/entities/user.entity';
import { Actions } from './access-control.const';
import { Request } from 'express';
import { EnvVars } from '../../envs/validate.env';
import { RequestMethod } from '../../utils/api-util/api-util.const';

@Injectable()
export class AccessControlGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private reflector: Reflector,
  ) {}

  getCurrentRoute(req: Request) {
    const { path, params } = req;
    let basePath = path;
    for (const [key, value] of Object.entries(params)) {
      basePath = basePath.replace(value, `:${key}`);
    }
    return basePath.replace(this.configService.get(EnvVars.APP_PREFIX)!, '');
  }

  private async canAccessResources(userID: User['id'], permissionKey: string) {
    const isSupperAdmin = await this.usersService.isSupperAdmin(userID);
    if (isSupperAdmin) return true;

    const canAccess = await this.usersService.isExistPermissionKey({
      userID,
      permissionKey,
    });
    return canAccess;
  }

  getAction(httpMethod: RequestMethod) {
    const actionsConverter = {
      [RequestMethod.GET]: Actions.READ,
      [RequestMethod.POST]: Actions.CREATE,
      [RequestMethod.PUT]: Actions.UPDATE,
      [RequestMethod.PATCH]: Actions.UPDATE,
      [RequestMethod.DELETE]: Actions.DELETE,
    };
    const action = actionsConverter[httpMethod];
    if (!action) throw new BadRequestException('Action not define!');
    return action;
  }

  async canActivate(context: ExecutionContext) {
    const isSkipAuth = this.reflector.getAllAndOverride<boolean>(IS_SKIP_AUTH, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isSkipAuth) {
      return true;
    }

    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const user = req['user'];
    if (!user) return false;

    const route = this.getCurrentRoute(req);
    const action = this.getAction(req.method as unknown as RequestMethod);
    const canAccess = await this.canAccessResources(
      user.userID as string,
      `[${route}]_[${action}]`,
    );
    return canAccess;
  }
}
