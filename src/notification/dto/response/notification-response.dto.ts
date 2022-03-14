import { PickType } from '@nestjs/swagger';
import { Article } from '@root/article/entities/article.entity';
import { Notification } from '@root/notification/entities/notification.entity';
import { BaseNotificationDto } from '../base-notification.dto';

export class NotificationResponseDto extends PickType(BaseNotificationDto, [
  'id',
  'type',
  'content',
  'articleId',
  'article',
  'isRead',
  'createdAt',
  'updatedAt',
]) {
  constructor(config: {
    id: number;
    type: string;
    content: string;
    articleId: number;
    article: Article;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    super();

    this.id = config.id;
    this.type = config.type;
    this.content = config.content;
    this.articleId = config.articleId;
    this.article = config.article;
    this.isRead = config.isRead;
    this.createdAt = config.createdAt;
    this.updatedAt = config.updatedAt;
  }

  static of(config: {
    notification: Notification;
    article: Article;
  }): NotificationResponseDto {
    return new NotificationResponseDto({
      ...config.notification,
      ...config,
    });
  }

  static ofArray(config: {
    notifications: Notification[];
  }): NotificationResponseDto[] {
    return config.notifications.map((notification) => {
      return NotificationResponseDto.of({
        notification,
        article: notification.article,
      });
    });
  }
}
