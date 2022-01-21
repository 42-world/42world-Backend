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
import { Notification } from '@root/notification/entities/notification.entity';

@ApiCookieAuth()
@ApiUnauthorizedResponse({ description: '인증 실패' })
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {}

  @Get()
  @ApiOperation({ summary: '내 정보 가져오기' })
  @ApiOkResponse({ description: '내 정보', type: User })
  getOne(@GetUser() user: User): User {
    return user;
  }

  @Get('profile/:id')
  @ApiOperation({ summary: '특정 유저 정보 가져오기' })
  @ApiOkResponse({ description: '유저 정보', type: User })
  getOneById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.getOne(id);
  }

  @Get('notification')
  @ApiOperation({ summary: '알람 가져오기 ' })
  @ApiOkResponse({ description: '알람들', type: [Notification] })
  getNotification(@GetUser('id') id: number): Promise<Notification[]> {
    return this.notificationService.getByUserId(id);
  }

  @Put('notification/readall')
  @ApiOperation({ summary: '알람 다 읽기' })
  @ApiOkResponse({ description: '알림 다 읽음' })
  updateNotificationIsRead(@GetUser('id') id: number): Promise<void> {
    return this.notificationService.updateIsReadByUserId(id);
  }

  @Put('profile')
  @ApiOperation({ summary: '유저 프로필 변경' })
  @ApiOkResponse({ description: '변경된 정보', type: User })
  update(
    @GetUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(user, updateUserDto);
  }

  @Delete()
  @ApiOperation({ summary: '유저 삭제' })
  @ApiOkResponse({ description: '유저 삭제 성공' })
  remove(@GetUser('id') id: number): Promise<void> {
    return this.userService.remove(id);
  }
}
