import { NotificationType } from '@app/entity/notification/interfaces/notifiaction.interface';
import { ApiProperty } from '@nestjs/swagger';

export class BaseNotificationDto {
  @ApiProperty()
  id!: number;

  @ApiProperty({ enum: NotificationType })
  type!: string;

  @ApiProperty()
  content!: string;

  @ApiProperty()
  articleId: number;

  @ApiProperty()
  isRead!: boolean;

  @ApiProperty()
  userId!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
