import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User, UserRole } from '@root/user/entities/user.entity';
import { GithubProfile } from './interfaces/github-profile.interface';
import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY, ROLE_KEY } from './constants/metadata-keys';

export const GetUser = createParamDecorator(
  (data: 'id' | null, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    if (data) return req.user[data];
    return req.user;
  },
);

export const GetGithubProfile = createParamDecorator(
  (data, ctx: ExecutionContext): GithubProfile => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);

export const Admin = () => SetMetadata(ROLE_KEY, UserRole.ADMIN);

export const Cadet = () => SetMetadata(ROLE_KEY, UserRole.CADET);

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
