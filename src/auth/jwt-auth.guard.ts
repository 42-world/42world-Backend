import { AuthGuard } from '@nestjs/passport';
import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@root/user/entities/user.entity';
import { UserRole } from '@user/interfaces/userrole.interface';
import { IS_PUBLIC_KEY, ROLE_KEY } from './constants/metadata-keys';
import { FORBIDDEN_USER_ROLE } from '@auth/constant';

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
    const role: UserRole[] = this.reflector.get<UserRole[] | undefined>(
      ROLE_KEY,
      context.getHandler(),
    ) ?? [UserRole.CADET, UserRole.ADMIN];

    if (!role.includes(u.role as UserRole)) {
      throw new ForbiddenException(FORBIDDEN_USER_ROLE);
    }
    return user;
  }
}
