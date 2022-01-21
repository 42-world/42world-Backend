import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from '@root/article/entities/article.entity';
import { Comment } from '@root/comment/entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification, NotificationType } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  createNewComment(article: Article, comment: Comment): Promise<Notification> {
    const notification: CreateNotificationDto = {
      type: NotificationType.NEW_COMMENT,
      content: comment.content,
      user_id: article.writer_id,
    };
    return this.notificationRepository.save(notification);
  }

  getByUserId(user_id: number): Promise<Notification[]> {
    return this.notificationRepository.find({ where: { user_id } });
  }

  async updateIsReadByUserId(user_id: number): Promise<void> {
    const notifications = await this.notificationRepository.find({
      where: { user_id, is_read: false },
    });
    notifications.forEach((notification) => (notification.is_read = true));
    this.notificationRepository.save(notifications);
  }
}
