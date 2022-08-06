import { Article } from '@app/entity/article/article.entity';
import { Comment } from '@app/entity/comment/comment.entity';
import { NotificationType } from '@app/entity/notification/interfaces/notifiaction.interface';
import { Notification } from '@app/entity/notification/notification.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async createNewComment(article: Article, comment: Comment): Promise<Notification> {
    const notification = new CreateNotificationDto({
      type: NotificationType.NEW_COMMENT,
      content: `게시글 ${article.title} 에 새로운 댓글이 달렸습니다.\n${comment.content}`,
      articleId: article.id,
      userId: article.writerId,
    });
    return this.notificationRepository.save(notification);
  }

  async findByUserId(userId: number): Promise<Notification[]> {
    return this.notificationRepository.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async updateIsReadByUserId(userId: number): Promise<void> {
    const notifications = await this.notificationRepository.find({
      where: { userId, isRead: false },
    });
    notifications.forEach((notification) => (notification.isRead = true));
    await this.notificationRepository.save(notifications);
  }
}
