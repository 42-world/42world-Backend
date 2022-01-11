import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { GithubAuthGuard } from './../auth/github-auth.guard';
import { AuthService } from './../auth/auth.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService, //private readonly authService: AuthService,
  ) {}

  // @UseGuards(GithubAuthGuard)
  // @Post('auth/login')
  // create(@Request() req) {
  //  return this.authService.login(req.user);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile(@Request() req) {
  //  return req.user;
  // }
  // main에서 이처럼 JwtAuthGuard를 걸어주고, accessToken을 확인
  // refresh Token도 없으면 에러, 있으면 새로 발급
  // canActive 기능에 대해 알아보자

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
