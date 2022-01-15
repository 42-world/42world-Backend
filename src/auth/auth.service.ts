import { AccessToken } from './interfaces/access-token.interface';
import { JWTPayload } from './interfaces/jwt-payload.interface';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  getJWT(payload: JWTPayload): AccessToken {
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
