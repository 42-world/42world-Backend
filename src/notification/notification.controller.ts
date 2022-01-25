import { Controller, Get, Patch } from '@nestjs/common';
import { Notification } from './entities/notification.entity';
import { NotificationService } from './notification.service';
import { GetUser } from '@root/auth/auth.decorator';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiCookieAuth()
@ApiUnauthorizedResponse({ description: '인증 실패' })
@ApiTags('Notification')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: '알람 가져오기 ' })
  @ApiOkResponse({ description: '알람들', type: [Notification] })
  findAll(@GetUser('id') id: number): Promise<Notification[]> {
    return this.notificationService.findByUserId(id);
  }

  @Patch('/readall')
  @ApiOperation({ summary: '알람 다 읽기' })
  @ApiOkResponse({ description: '알림 다 읽음' })
  update(@GetUser('id') id: number): Promise<void> {
    return this.notificationService.updateIsReadByUserId(id);
  }
}
