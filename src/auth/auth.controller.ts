import { UserService } from './../user/user.service';
import { GithubAuthGuard } from './github-auth.guard';
import { AuthService } from './auth.service';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';

@Controller('auth/github')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @UseGuards(GithubAuthGuard)
  githubLogin() {
    console.log('send to login page');
    return '임채욱 바보';
  }

  @Get('callback')
  @UseGuards(GithubAuthGuard)
  async githubCallback(@Req() req) {
    console.log('req.user: ', req.user);

    // 여기서 서비스를 불러서
    // 거기서 db에 profile.id를 github_id로 저장
    await this.userService.create(req.user);
    // 그리고 거기서 access token과 refresh token을 만든다
    return 'babo';
  }
}
