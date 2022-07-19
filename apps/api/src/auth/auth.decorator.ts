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

export const Auth = (...roles: string[]) => SetMetadata(REQUIRE_ROLES, roles);
