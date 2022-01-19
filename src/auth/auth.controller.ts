import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from '@user/user.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GithubAuthGuard } from './github-auth.guard';
import { JWTPayload } from './interfaces/jwt-payload.interface';
import { GithubProfile } from './interfaces/github-profile.interface';
import { ACCESS_TOKEN } from './constants/access-token';
import { GetGithubProfile, Public } from './auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('github')
  @Public()
  @UseGuards(GithubAuthGuard)
  githubLogin(): void {
    console.log('send to login page');
    return;
  }

  @Get('github/callback')
  @Public()
  @UseGuards(GithubAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  signout(@Res({ passthrough: true }) response: Response): void {
    response.clearCookie(ACCESS_TOKEN);
  }
}
