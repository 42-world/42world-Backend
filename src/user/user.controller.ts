import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiCookieAuth,
  ApiUnauthorizedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { GetUser } from '@auth/auth.decorator';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { NotificationService } from '@root/notification/notification.service';
import { ArticleService } from '@article/article.service';

@ApiCookieAuth()
@ApiUnauthorizedResponse({ description: '인증 실패' })
@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    private readonly articleService: ArticleService,
  ) {}

  @Get()
  @ApiOperation({ summary: '내 정보 가져오기' })
  @ApiOkResponse({ description: '내 정보', type: User })
  getOne(@GetUser() user: User): User {
    return user;
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 유저 정보 가져오기' })
  @ApiOkResponse({ description: '유저 정보', type: User })
  getOneById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.getOne(id);
  }

  @Put()
  @ApiOperation({ summary: '유저 프로필 변경' })
  @ApiOkResponse({ description: '변경된 정보', type: User })
  update(
    @GetUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateProfile(user, updateUserDto);
  }

  @Delete()
  @ApiOperation({ summary: '유저 삭제' })
  @ApiOkResponse({ description: '유저 삭제 성공' })
  remove(@GetUser('id') id: number): Promise<void> {
    return this.userService.remove(id);
  }

  @Get('me/articles')
  @ApiOperation({ summary: '내가 작성한 글' })
  @ApiOkResponse({ description: '내가 작성한 글 목록' })
  findAllMyArticle(@GetUser('id') id: number) {
    return this.articleService.findAllMyArticle(id);
  }
}
