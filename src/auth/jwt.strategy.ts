import { UserService } from '@user/user.service';
import { jwtConstants } from './constant';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ACCESS_TOKEN } from './constants/access-token';

const getAccessToken = (request: any): string => {
  return request.cookies[ACCESS_TOKEN];
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([getAccessToken]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findOne(payload.userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
