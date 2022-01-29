import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { Comment } from '../../comment/entities/comment.entity';

export class LikeCommentDto extends Comment {
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: 'true' })
  isLike?: boolean;
}
