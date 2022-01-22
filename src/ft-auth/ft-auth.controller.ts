import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { FtAuthService } from './ft-auth.service';
import { GetUser } from '@root/auth/auth.decorator';
import { User } from '@root/user/entities/user.entity';

@Controller('ft-auth')
export class FtAuthController {
  constructor(private readonly ftAuthService: FtAuthService) {}

  @Post()
  async sendMail(@GetUser() user: User, @Body('intraId') intraId: string) {
    await this.ftAuthService.signin(intraId, user);
  }

  @Get()
  async getAuthCode(@Query('code') code: string) {
    await this.ftAuthService.getAuth(code);
  }
}
