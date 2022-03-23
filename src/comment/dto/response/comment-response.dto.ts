import { ApiProperty, PickType } from '@nestjs/swagger';
import { BaseCommentDto } from '@root/comment/dto/base-comment.dto';
import { Comment } from '@root/comment/entities/comment.entity';
import { ReactionComment } from '@root/reaction/entities/reaction-comment.entity';
import { UserResponseDto } from '@root/user/dto/response/user-response.dto';
import { User } from '@root/user/entities/user.entity';

export class CommentResponseDto extends PickType(BaseCommentDto, [
  'id',
  'content',
  'likeCount',
  'articleId',
  'writerId',
  'writer',
  'createdAt',
  'updatedAt',
]) {
  @ApiProperty({ example: false })
  isLike!: boolean;

  @ApiProperty({ example: false })
  isSelf!: boolean;

  constructor(config: {
    id: number;
    content: string;
    likeCount: number;
    articleId: number;
    writerId: number;
    writer: UserResponseDto;
    createdAt: Date;
    updatedAt: Date;
    isLike: boolean;
    isSelf: boolean;
  }) {
    super();

    this.id = config.id;
    this.content = config.content;
    this.likeCount = config.likeCount;
    this.articleId = config.articleId;
    this.writerId = config.writerId;
    this.writer = config.writer;
    this.createdAt = config.createdAt;
    this.updatedAt = config.updatedAt;
    this.isLike = config.isLike;
    this.isSelf = config.isSelf;
  }

  static of(config: {
    comment: Comment;
    writer: User;
    isLike: boolean;
    isSelf: boolean;
  }): CommentResponseDto {
    return new CommentResponseDto({
      ...config.comment,
      ...config,
      writer: UserResponseDto.of({ user: config.writer }),
    });
  }

  static ofArray(config: {
    comments: Comment[];
    reactionComments?: ReactionComment[];
    userId: number;
  }): CommentResponseDto[] {
    config.reactionComments = config.reactionComments || [];
    return config.comments.map((comment: Comment) => {
      const isLike = !!config.reactionComments.find(
        (reactionComment) => reactionComment.commentId === comment.id,
      );

      return CommentResponseDto.of({
        comment,
        writer: comment.writer,
        isLike,
        isSelf: config.userId === comment.writerId,
      });
    });
  }
}
