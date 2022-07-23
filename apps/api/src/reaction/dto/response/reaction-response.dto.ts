import { Article } from '@app/entity/article/article.entity';
import { Comment } from '@app/entity/comment/comment.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ReactionResponseDto {
  @ApiProperty()
  likeCount!: number;

  @ApiProperty({ example: false })
  isLike!: boolean;

  constructor(config: { likeCount: number; isLike: boolean }) {
    this.likeCount = config.likeCount;
    this.isLike = config.isLike;
  }

  static of<T extends Article | Comment>(config: { entity: T; isLike: boolean }) {
    return new ReactionResponseDto({
      likeCount: config.entity.likeCount,
      isLike: config.isLike,
    });
  }
}
