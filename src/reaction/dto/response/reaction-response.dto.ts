import { ApiProperty } from '@nestjs/swagger';
import { Article } from '@root/article/entities/article.entity';
import { Comment } from '@root/comment/entities/comment.entity';

export class ReactionResponseDto {
  @ApiProperty()
  likeCount!: number;

  @ApiProperty({ example: false })
  isLike!: boolean;

  constructor(config: { likeCount: number; isLike: boolean }) {
    this.likeCount = config.likeCount;
    this.isLike = config.isLike;
  }

  static of<T extends Article | Comment>(config: {
    entity: T;
    isLike: boolean;
  }) {
    return new ReactionResponseDto({
      likeCount: config.entity.likeCount,
      isLike: config.isLike,
    });
  }
}
