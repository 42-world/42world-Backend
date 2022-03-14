import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from '@root/article/entities/article.entity';
import { Comment } from '@root/comment/entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';
import { NotificationType } from './interfaces/notifiaction.interface';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  createNewComment(article: Article, comment: Comment): Promise<Notification> {
    const notification = new CreateNotificationDto({
      type: NotificationType.NEW_COMMENT,
      content: `게시글 ${article.title} 에 새로운 댓글이 달렸습니다.\n${comment.content}`,
      articleId: article.id,
      userId: article.writerId,
    });
    return this.notificationRepository.save(notification);
  }

  findByUserId(userId: number): Promise<Notification[]> {
    return this.notificationRepository.find({ where: { userId } });
  }

  async updateIsReadByUserId(userId: number): Promise<void> {
    const notifications = await this.notificationRepository.find({
      where: { userId, isRead: false },
    });
    notifications.forEach((notification) => (notification.isRead = true));
    this.notificationRepository.save(notifications);
  }
}
