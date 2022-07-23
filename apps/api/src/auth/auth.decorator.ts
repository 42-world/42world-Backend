import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { User } from '@app/entity/user/user.entity';
import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { REQUIRE_ROLES } from './auth.constant';
import { GithubProfile } from './interfaces/github-profile.interface';

/**
 * @description Auth decorator를 써야 사용가능
 */
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

export type AuthDecoratorParam = [AuthType, ...UserRole[]];

/**
 * 1. 누구나 사용가능 -> Auth() 없음
 * 2. 누구나 접속가능하지만 권한따라 사용가능 -> Auth('public') ==> Auth('deny')
 * 3. 로그인한 사용자만 사용가능 -> Auth() ==> Auth('deny', UserRole.GUEST)
 * 4. 특정 사용자만 사용가능 -> Auth('only', UserRole.ADMIN)
 *
 * 1 번과 2번이 다른점 : 2번은 AuthUser를 쓸 수 있지만, 1번은 못씀!
 */
export const Auth = (allow?: AuthType | 'public', ...param: UserRole[]) => {
  if (!allow) {
    return SetMetadata(REQUIRE_ROLES, ['deny', UserRole.GUEST]);
  }

  if (allow === 'public') {
    return SetMetadata(REQUIRE_ROLES, ['deny']);
  }

  return SetMetadata(REQUIRE_ROLES, [allow, ...param]);
};
