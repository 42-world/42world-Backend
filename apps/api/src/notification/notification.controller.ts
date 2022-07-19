import { Auth, AuthUser } from '@api/auth/auth.decorator';
import { Controller, Get, Patch } from '@nestjs/common';
import { ApiCookieAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { NotificationResponseDto } from './dto/response/notification-response.dto';
import { NotificationService } from './notification.service';

@ApiCookieAuth()
@ApiUnauthorizedResponse({ description: '인증 실패' })
@ApiTags('Notification')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @Auth()
  @ApiOperation({ summary: '알람 가져오기 ' })
  @ApiOkResponse({ description: '알람들', type: [NotificationResponseDto] })
  async findAll(@AuthUser('id') id: number): Promise<NotificationResponseDto[]> {
    const notifications = await this.notificationService.findByUserId(id);

    return NotificationResponseDto.ofArray({ notifications });
  }

  @Patch('/readall')
  @Auth()
  @ApiOperation({ summary: '알람 다 읽기' })
  @ApiOkResponse({ description: '알림 다 읽음' })
  async update(@AuthUser('id') id: number): Promise<void> {
    return this.notificationService.updateIsReadByUserId(id);
  }
}
