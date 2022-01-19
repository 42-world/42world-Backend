import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@root/user/entities/user.entity';
import { GithubProfile } from './interfaces/github-profile.interface';

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
