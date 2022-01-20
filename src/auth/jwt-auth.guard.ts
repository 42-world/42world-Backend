import { AuthGuard } from '@nestjs/passport';
import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User, UserRole } from '@root/user/entities/user.entity';
import { IS_PUBLIC_KEY, ROLE_KEY } from './constants/metadata-keys';

/**
 * Custom AuthGuard to check public handler and user roles
 * @see also https://docs.nestjs.com/security/authentication#extending-guards
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic =
      this.reflector.get<boolean | undefined>(
        IS_PUBLIC_KEY,
        context.getHandler(),
      ) ?? false;

    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest<TUser>(
    err: any,
    user: any,
    info: any,
    context: any,
    status?: any,
  ): TUser {
    const u = super.handleRequest(err, user, info, context, status) as User;
    const role =
      this.reflector.get<UserRole | undefined>(
        ROLE_KEY,
        context.getHandler(),
      ) ?? UserRole.CADET;

    if (!(u.role === role)) {
      throw new ForbiddenException();
    }
    return user;
  }
}
