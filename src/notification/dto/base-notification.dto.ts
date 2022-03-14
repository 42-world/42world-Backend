import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '../interfaces/notifiaction.interface';
import { Article } from '@root/article/entities/article.entity';
import { User } from '@root/user/entities/user.entity';

export class BaseNotificationDto {
  @ApiProperty()
  id!: number;

  @ApiProperty({ enum: NotificationType })
  type!: string;

  @ApiProperty()
  content!: string;

  @ApiProperty()
  articleId: number;

  @ApiProperty({ type: () => Article })
  article?: Article;

  @ApiProperty()
  isRead!: boolean;

  @ApiProperty()
  userId!: number;

  @ApiProperty({ type: () => User })
  user?: User;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
