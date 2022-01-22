import { NotificationType } from '../entities/notification.entity';

export class CreateNotificationDto {
  readonly type!: NotificationType;
  readonly content!: string;
  readonly userId!: number;
}
