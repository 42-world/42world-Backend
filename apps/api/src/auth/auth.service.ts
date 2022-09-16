import { UserService } from '@api/user/user.service';
import { User } from '@app/entity/user/user.entity';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CookieOptions } from 'express';
import { GithubProfile, JWTPayload } from './types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(githubProfile: GithubProfile): Promise<User> {
    const user = await this.userService.findOne({ where: { githubId: githubProfile.id } });

    if (user) {
      user.lastLogin = new Date();
      return await user.save();
    }

    const newUser = new User();
    newUser.nickname = githubProfile.username;
    newUser.githubUsername = githubProfile.username;
    newUser.githubUid = githubProfile.id;
    newUser.lastLogin = new Date();

    return await this.userService.create(newUser);
  }

  getJwt(user: User): string {
    const payload: JWTPayload = {
      userId: user.id,
      userRole: user.role,
    };
    return this.jwtService.sign(payload);
  }

  getCookieOption = (): CookieOptions => {
    const oneHour = 60 * 60 * 1000;
    const maxAge = 7 * 24 * oneHour; // 7days

    if (this.configService.get('NODE_ENV') === 'prod') {
      return { httpOnly: true, secure: true, sameSite: 'lax', maxAge };
    } else if (this.configService.get('NODE_ENV') === 'alpha') {
      return { httpOnly: true, secure: true, sameSite: 'none', maxAge };
    }

    return { httpOnly: true, maxAge };
  };
}
