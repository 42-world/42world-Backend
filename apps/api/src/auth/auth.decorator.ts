import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { User } from '@app/entity/user/user.entity';
import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY, ROLE_KEY } from './auth.constant';
import { GithubProfile } from './interfaces/github-profile.interface';

export const GetUser = createParamDecorator((data: 'id' | null, ctx: ExecutionContext): User => {
  const req = ctx.switchToHttp().getRequest();
  if (data) return req.user[data];
  return req.user;
});

export const GetGithubProfile = createParamDecorator((data, ctx: ExecutionContext): GithubProfile => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});

export const Admin = () => SetMetadata(ROLE_KEY, [UserRole.ADMIN]);

export const Cadet = () => SetMetadata(ROLE_KEY, [UserRole.CADET, UserRole.ADMIN]);

export const AlsoNovice = () => SetMetadata(ROLE_KEY, [UserRole.NOVICE, UserRole.CADET, UserRole.ADMIN]);

export const OnlyNovice = () => SetMetadata(ROLE_KEY, [UserRole.NOVICE, UserRole.ADMIN]);

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
