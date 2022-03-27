import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '../interfaces/notifiaction.interface';

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
