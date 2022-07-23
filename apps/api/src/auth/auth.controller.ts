import { UserService } from '@api/user/user.service';
import { getCookieOption } from '@app/utils/utils';
import { Controller, Delete, Get, Res, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { Auth, ReqGithubProfile } from './auth.decorator';
import { AuthService } from './auth.service';
import { GithubAuthGuard } from './github-auth.guard';
import { GithubProfile } from './interfaces/github-profile.interface';
import { JWTPayload } from './interfaces/jwt-payload.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  @Get('github')
  @UseGuards(GithubAuthGuard)
  @ApiOperation({
    summary: '깃허브 로그인',
    description: `
      로그인이 되어있지 않은경우, 깃허브 로그인 페이지로 이동합니다
      깃허브 로그인이 끝나면 지정된 프론트 페이지로 이동합니다.`,
  })
  @ApiOkResponse({ description: '깃허브 페이지' })
  githubLogin(): void {
    console.log('send to login page');
    return;
  }

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  @ApiOperation({
    summary: '깃허브 로그인 콜백',
    description: `
      깃허브 로그인이 끝나고 호출해주세요.
      깃허브 로그인이 끝나지 않았다면,
      다시 깃허브 로그인 페이지로 이동합니다.`,
  })
  @ApiOkResponse({ description: '로그인 성공' })
  async githubCallback(
    @ReqGithubProfile() githubProfile: GithubProfile,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const user = await this.userService.githubLogin(githubProfile);
    const jwt = this.authService.getJWT({
      userId: user.id,
      userRole: user.role,
    } as JWTPayload);
    response.cookie(process.env.ACCESS_TOKEN_KEY, jwt, getCookieOption());
  }

  @Delete('signout')
  @Auth()
  @ApiCookieAuth()
  @ApiOperation({ summary: '로그아웃' })
  @ApiOkResponse({ description: '로그아웃 성공' })
  @ApiUnauthorizedResponse({ description: '인증 실패' })
  signout(@Res({ passthrough: true }) response: Response): void {
    response.clearCookie(process.env.ACCESS_TOKEN_KEY, getCookieOption());
  }
}
