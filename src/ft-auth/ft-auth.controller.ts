import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { FtAuthService } from './ft-auth.service';
import { GetUser, Novice, Public } from '@root/auth/auth.decorator';
import { User } from '@root/user/entities/user.entity';
import { SigninFtAuthDto } from './dto/signin-ft-auth.dto';

@Controller('ft-auth')
export class FtAuthController {
  constructor(private readonly ftAuthService: FtAuthService) {}

  @Post()
  @Novice()
  async sendMail(@GetUser() user: User, @Body() { intraId }: SigninFtAuthDto) {
    await this.ftAuthService.signin(intraId, user);
  }

  @Get()
  @Public() // TODO: check this
  async getAuthCode(@Query('code') code: string) {
    await this.ftAuthService.getAuth(code);
  }
}
