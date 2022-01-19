import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { GithubAuthGuard } from './../auth/github-auth.guard';
import { AuthService } from './../auth/auth.service';
import {
  Controller,
  Get,
  Post,
  Put,
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
import { User } from './entities/user.entity';
import { GetUser } from '@root/auth/auth.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getOne(@GetUser('id') id: number): Promise<User> {
    return this.userService.getOne(id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getOneById(@Param('id') id: number): Promise<User> {
    return this.userService.getOne(id);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  update(
    @GetUser('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  remove(@GetUser('id') id: number): Promise<void> {
    return this.userService.remove(id);
  }
}
