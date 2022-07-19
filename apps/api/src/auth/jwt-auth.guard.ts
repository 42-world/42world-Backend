import { FORBIDDEN_USER_ROLE, REQUIRE_ROLES } from '@api/auth/auth.constant';
import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { User } from '@app/entity/user/user.entity';
import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

/**
 * Custom AuthGuard to check public handler and user roles
 * @see also https://docs.nestjs.com/security/authentication#extending-guards
 *
 * 1. JwtAuthGuard.canActivate -> check if user is allowed to access handler
 * 2. JwtStrategy.validate -> get user from jwt payload or db
 * 3. JwtAuthGuard.handleRequest -> check user roles
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const requireAuth = this.reflector.get<UserRole[]>(REQUIRE_ROLES, context.getHandler());

    if (!requireAuth) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest<TUser>(err: any, user: any, info: any, context: any, status?: any): TUser {
    const u = super.handleRequest(err, user, info, context, status) as User;
    const requireAuth = this.reflector.get<UserRole[]>(REQUIRE_ROLES, context.getHandler());

    if (!requireAuth.includes(u.role as UserRole)) {
      throw new ForbiddenException(FORBIDDEN_USER_ROLE);
    }

    return user;
  }
}
