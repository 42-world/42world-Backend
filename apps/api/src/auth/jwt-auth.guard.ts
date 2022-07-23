import { FORBIDDEN_USER_ROLE, REQUIRE_ROLES } from '@api/auth/auth.constant';
import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { User } from '@app/entity/user/user.entity';
import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { AuthDecoratorParam } from './auth.decorator';
import { getAccessToken } from './jwt.strategy';

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
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const requireAuth = this.reflector.get<AuthDecoratorParam>(REQUIRE_ROLES, context.getHandler());

    if (!requireAuth) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    if (!getAccessToken(request)) {
      request.user = new User();
      request.user.id = -1;
      request.user.role = UserRole.GUEST;
      try {
        this.handleRequest(null, request.user, null, context);
      } catch (error) {
        throw new UnauthorizedException();
      }
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest<TUser>(err: any, user: any, info: any, context: any, status?: any): TUser {
    const u = super.handleRequest(err, user, info, context, status) as User;
    const requireAuth = this.reflector.get<AuthDecoratorParam>(REQUIRE_ROLES, context.getHandler());

    if (requireAuth[0] === 'allow' && !requireAuth.includes(u.role)) {
      throw new ForbiddenException(FORBIDDEN_USER_ROLE);
    }

    if (requireAuth[0] === 'deny' && requireAuth.includes(u.role)) {
      throw new ForbiddenException(FORBIDDEN_USER_ROLE);
    }

    return user;
  }
}
