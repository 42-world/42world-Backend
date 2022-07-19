import { Auth, AuthUser } from '@api/auth/auth.decorator';
import { User } from '@app/entity/user/user.entity';
import { logger } from '@app/utils/logger';
import { Body, Controller, Get, HttpCode, Post, Query, Render } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SigninIntraAuthRequestDto } from './dto/signin-intra-auth-request.dto';
import { IntraAuthService } from './intra-auth.service';

@ApiTags('Intra Auth')
@Controller('intra-auth')
export class IntraAuthController {
  constructor(private readonly intraAuthService: IntraAuthService) {}

  @Post()
  @HttpCode(200)
  @Auth()
  @ApiCookieAuth()
  @ApiOperation({ summary: '42인증 메일 전송' })
  @ApiOkResponse({ description: '메일 전송 성공' })
  @ApiUnauthorizedResponse({ description: '인증 실패' })
  @ApiForbiddenResponse({
    description: '접근 권한 없음 | 이미 인증된 사용자 | 이미 가입된 카뎃',
  })
  async sendMail(@AuthUser() user: User, @Body() { intraId }: SigninIntraAuthRequestDto) {
    await this.intraAuthService.signin(intraId, user);
  }

  @Get()
  @Render('intra-auth/results.ejs')
  @ApiOperation({ summary: '42인증 메일 코드 확인' })
  @ApiOkResponse({ description: 'results.ejs 파일 렌더링' })
  async getAuthCode(@Query('code') code: string) {
    try {
      await this.intraAuthService.getAuth(code);

      return {
        title: 'Hello World!',
        message: '인증에 성공했습니다! 🥳',
        button: 'Welcome, Cadet!',
        endpoint: process.env.FRONT_URL,
      };
    } catch (e) {
      logger.error(e);
      return {
        title: 'Oops! There is an error ...',
        message: '인증에 실패했습니다 😭',
        button: 'Retry',
        endpoint: process.env.FRONT_URL,
      };
    }
  }
}
