import { Body, Controller, Post, Get, Query, Redirect } from '@nestjs/common';
import { FtAuthService } from './ft-auth.service';
import { GetUser, Novice, Public } from '@root/auth/auth.decorator';
import { User } from '@root/user/entities/user.entity';
import { SigninFtAuthDto } from './dto/signin-ft-auth.dto';
import {
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('FT Auth')
@Controller('ft-auth')
export class FtAuthController {
  constructor(private readonly ftAuthService: FtAuthService) {}

  @Post()
  @Novice()
  @ApiCookieAuth()
  @ApiOperation({ summary: '42인증 메일 전송' })
  @ApiOkResponse({ description: '메일 전송 성공' })
  @ApiUnauthorizedResponse({ description: '인증 실패' })
  @ApiForbiddenResponse({
    description: '접근 권한 없음 | 이미 인증된 사용자 | 이미 가입된 카뎃',
  })
  async sendMail(@GetUser() user: User, @Body() { intraId }: SigninFtAuthDto) {
    await this.ftAuthService.signin(intraId, user);
  }

  @Get()
  @Redirect(process.env.FRONT_URL || 'localhost:3000', 301)
  @Public() // TODO: check this
  @ApiOperation({ summary: '42인증 메일 코드 확인' })
  @ApiOkResponse({ description: '42인증 완료' })
  @ApiForbiddenResponse({ description: '42인증 메일 코드 만료됨' })
  async getAuthCode(@Query('code') code: string) {
    await this.ftAuthService.getAuth(code);
  }
}
