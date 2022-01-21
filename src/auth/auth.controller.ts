import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from '@user/user.service';
import { AuthService } from './auth.service';
import { GithubAuthGuard } from './github-auth.guard';
import { JWTPayload } from './interfaces/jwt-payload.interface';
import { GithubProfile } from './interfaces/github-profile.interface';
import { ACCESS_TOKEN } from './constants/access-token';
import { GetGithubProfile, Public } from './auth.decorator';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('github')
  @Public()
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
  @Public()
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
    @GetGithubProfile() githubProfile: GithubProfile,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const user = await this.userService.githubLogin(githubProfile);
    const jwt = this.authService.getJWT({
      userId: user.id,
      userRole: user.role,
    } as JWTPayload);
    response.cookie(ACCESS_TOKEN, jwt);
  }

  @Get('signout')
  @ApiCookieAuth()
  @ApiOperation({ summary: '로그아웃' })
  @ApiOkResponse({ description: '로그아웃 성공' })
  @ApiUnauthorizedResponse({ description: '인증 실패' })
  signout(@Res({ passthrough: true }) response: Response): void {
    response.clearCookie(ACCESS_TOKEN);
  }
}
