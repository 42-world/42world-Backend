import { JwtAuthGuard } from './jwt-auth.guard';
import { UserService } from '@user/user.service';
import { GithubAuthGuard } from './github-auth.guard';
import { AuthService } from './auth.service';
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { JWTPayload } from './interfaces/jwt-payload.interface';
import { Response } from 'express';
import { ACCESS_TOKEN } from './constants/access-token';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('github')
  @UseGuards(GithubAuthGuard)
  githubLogin() {
    console.log('send to login page');
    return;
  }

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  async githubCallback(
    @Req() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.userService.githubLogin(req.user);
    const jwt = this.authService.getJWT({
      userId: user.id,
      userRole: user.role,
    } as JWTPayload);
    response.cookie(ACCESS_TOKEN, jwt);
  }

  @Get('signout')
  @UseGuards(JwtAuthGuard)
  async signout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(ACCESS_TOKEN);
  }
}
