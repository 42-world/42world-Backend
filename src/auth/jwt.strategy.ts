import { UserService } from '@user/user.service';
import { jwtConstants } from './constant';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTPayload } from './interfaces/jwt-payload.interface';
import { User } from '@root/user/entities/user.entity';

const getAccessToken = (request: any): string => {
  if (process.env.NODE_ENV !== 'prod' && request.headers.authorization) {
    return request.headers.authorization;
  }

  return request.cookies[process.env.ACCESS_TOKEN_KEY];
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

  async validate(payload: JWTPayload): Promise<User> {
    try {
      return await this.userService.findOneByIdOrFail(payload.userId);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new UnauthorizedException();
      }
    }
  }
}
