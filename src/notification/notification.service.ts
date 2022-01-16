import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    return this.notificationRepository.save(createNotificationDto);
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
