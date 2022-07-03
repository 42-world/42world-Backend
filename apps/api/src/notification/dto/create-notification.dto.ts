import { NotificationType } from '@app/entity/notification/interfaces/notifiaction.interface';
import { PickType } from '@nestjs/swagger';
import { BaseNotificationDto } from './base-notification.dto';

export class CreateNotificationDto extends PickType(BaseNotificationDto, ['type', 'content', 'articleId', 'userId']) {
  constructor(config: { type: NotificationType; content: string; articleId: number; userId: number }) {
    super();

    this.type = config.type;
    this.content = config.content;
    this.articleId = config.articleId;
    this.userId = config.userId;
  }
}
