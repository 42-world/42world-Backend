import { UserService } from '@api/user/user.service';
import { User } from '@app/entity/user/user.entity';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTPayload } from './interfaces/jwt-payload.interface';

export const getAccessToken = (request: any): string => {
  return request.cookies[process.env.ACCESS_TOKEN_KEY];
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService, private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([getAccessToken]),
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
