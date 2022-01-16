import { JWTPayload } from './interfaces/jwt-payload.interface';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  getJWT(payload: JWTPayload): string {
    return this.jwtService.sign(payload);
  }
}
