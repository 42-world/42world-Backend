import { UserService } from '@api/user/user.service';
import { User } from '@app/entity/user/user.entity';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTPayload } from '../types';

export const getAccessToken = (key: string, request: any): string => {
  return request.cookies[key];
};

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService, private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([getAccessToken.bind(null, configService.get('ACCESS_TOKEN_KEY'))]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JWTPayload): Promise<User> {
    try {
      return await this.userService.findOneByIdOrFail(payload.userId);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new UnauthorizedException();
      }
      throw e;
    }
  }
}
