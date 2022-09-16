import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { User } from '@app/entity/user/user.entity';
import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { REQUIRE_ROLES } from './constant';
import { AuthType, GithubProfile } from './types';

/**
 * @description
 * 1. Auth() 없음 => 누구나 사용가능(인증 X, 인가 X)
 * 2. Auth('public') or Auth('deny') => 누구나 접속가능하지만 권한따라 사용가능(인증 △, 인가 O)
 * 3. Auth() or Auth('deny', UserRole.GUEST) => 로그인한 사용자만 권한따라 사용가능(인증 O, 인가 O)
 * 4. Auth('only', UserRole.ADMIN) => 특정 사용자만 사용가능(인증 O, 인가 O)
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

/**
 * @description Request에 담긴 User를 가져온다.
 * @note Auth decorator를 써야 사용가능
 */
export const AuthUser = createParamDecorator((data: 'id' | null, ctx: ExecutionContext): User => {
  const req = ctx.switchToHttp().getRequest();
  if (data) return req.user[data];
  return req.user;
});

/**
 * @description Request에 담긴 GithubProfile를 가져온다.
 * @note GithubAuthGuard 를 써야 사용가능
 */
export const ReqGithubProfile = createParamDecorator((data, ctx: ExecutionContext): GithubProfile => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});
