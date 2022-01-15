import { UserService } from '@user/user.service';
import { GithubAuthGuard } from './github-auth.guard';
import { AuthService } from './auth.service';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JWTPayload } from './interfaces/jwt-payload.interface';

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
    return 'haha';
  }

  @Get('callback')
  @UseGuards(GithubAuthGuard)
  async githubCallback(@Req() github) {
    const user = await this.userService.create(github.profile);
    return this.authService.getJWT({
      userId: user.id,
      userRole: user.role,
    } as JWTPayload);
  }
}
