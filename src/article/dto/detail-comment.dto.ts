import { ApiPropertyOptional } from '@nestjs/swagger';
import { Comment } from '@root/comment/entities/comment.entity';
import { IsBoolean, IsOptional } from 'class-validator';

export class DetailCommentDto extends Comment {
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: 'true' })
  isLike?: boolean;
}
