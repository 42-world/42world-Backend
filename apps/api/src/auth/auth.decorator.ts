import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { User } from '@app/entity/user/user.entity';
import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { REQUIRE_ROLES } from './auth.constant';
import { GithubProfile } from './interfaces/github-profile.interface';

export const AuthUser = createParamDecorator((data: 'id' | null, ctx: ExecutionContext): User => {
  const req = ctx.switchToHttp().getRequest();
  if (data) return req.user[data];
  return req.user;
});

export const ReqGithubProfile = createParamDecorator((data, ctx: ExecutionContext): GithubProfile => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});

type AuthType = 'allow' | 'deny';

export const Auth = (allow: AuthType = 'deny', ...param: Exclude<UserRole, UserRole.GUEST>[]) =>
  SetMetadata(REQUIRE_ROLES, [allow, ...param]);

export type AuthDecoratorParam = [AuthType, ...Exclude<UserRole, UserRole.GUEST>[]];
