import { FORBIDDEN_USER_ROLE, REQUIRE_ROLES } from '@api/auth/constant';
import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { User } from '@app/entity/user/user.entity';
import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { AuthDecoratorParam } from '../types';

/**
 * Custom AuthGuard to check public handler and user roles
 * @see also https://docs.nestjs.com/security/authentication#extending-guards
 *
 * 1. JwtAuthGuard.canActivate -> check if handler is public or not
 * 2. JwtStrategy.validate -> get user from jwt payload or db
 * 3. JwtAuthGuard.handleRequest -> check user roles
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const requireAuth = this.reflector.get<AuthDecoratorParam>(REQUIRE_ROLES, context.getHandler());

    if (!requireAuth) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest<TUser>(err: any, _user: any, info: any, context: any, status?: any): TUser {
    const requireAuth = this.reflector.get<AuthDecoratorParam>(REQUIRE_ROLES, context.getHandler());

    let user: User;

    try {
      // verity JWT token
      user = super.handleRequest(err, _user, info, context, status);
    } catch (error) {
      // Auth('public') 인경우 Guest 로 처리
      if (this.isAuthAllowRole(requireAuth, UserRole.GUEST)) {
        user = new User();
        user.id = -1;
        user.role = UserRole.GUEST;
        return user as unknown as TUser;
      }
      throw error;
    }

    if (!this.isAuthAllowRole(requireAuth, user.role)) {
      throw new ForbiddenException(FORBIDDEN_USER_ROLE);
    }

    return user as unknown as TUser;
  }

  private isAuthAllowRole(requireAuth: AuthDecoratorParam, role: UserRole): boolean {
    return (
      (requireAuth[0] === 'allow' && requireAuth.includes(role)) ||
      (requireAuth[0] === 'deny' && !requireAuth.includes(role))
    );
  }
}
