import { Strategy, VerifyCallback } from 'passport-github2';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      clientID: '1c53f03549f1ebbfcfdf',
      clientSecret: '208f820e890183e23c2ed3b0fe572d73cbc59014',
      callbackURL: 'http://localhost:8080', // frontend url
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    console.log('profile: ', profile);
    console.log('id ==', profile.id);
    const user = {
      id: profile.id,
      nickname: profile.username,
    };
    done(null, user);
  }
}