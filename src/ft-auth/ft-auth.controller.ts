import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { FtAuthService } from './ft-auth.service';
import { GetUser } from '@root/auth/auth.decorator';

@Controller('ft-auth')
export class FtAuthController {
  constructor(private readonly ftAuthService: FtAuthService) {}

  @Get()
  sendMail(@GetUser('id') userId: number, @Query('nickname') nickname: string) {
    this.ftAuthService.signin(nickname, userId);
  }

  @Get()
  async getAuthCode(@Query('code') code: string) {
    await this.ftAuthService.getAuth(code);
  }
}
