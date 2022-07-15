import { BaseCommentDto } from '@api/comment/dto/base-comment.dto';
import { AnonyUserResponseDto } from '@api/user/dto/response/anony-user-response.dto';
import { UserResponseDto } from '@api/user/dto/response/user-response.dto';
import { ANONY_USER_ID } from '@api/user/user.constant';
import { Comment } from '@app/entity/comment/comment.entity';
import { ReactionComment } from '@app/entity/reaction/reaction-comment.entity';
import { User } from '@app/entity/user/user.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';

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
    writer: UserResponseDto | AnonyUserResponseDto;
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
    isAnonymous: boolean;
  }): CommentResponseDto {
    const writer = config.isAnonymous ? AnonyUserResponseDto.of() : UserResponseDto.of({ user: config.writer });
    // TODO: ANONY_USER_ID 를 쓸게 아니라 게시글 마다 고유한 유저 아이디를 새로 발급해야한다. 새로운 해쉬 함수가 필요함
    // 그래야 페이지네이션 해도 익명 1, 익명 2, 작성자가 유지됨
    // 백엔드에는 게시글 고유 아이디만 주고, 프론트에서 조립하는게 맞음
    const writerId = config.isAnonymous ? ANONY_USER_ID : config.comment.writerId;
    return new CommentResponseDto({
      ...config.comment,
      ...config,
      writer,
      writerId,
    });
  }

  static ofArray(config: {
    comments: Comment[];
    reactionComments?: ReactionComment[];
    userId: number;
    isAnonymous: boolean;
  }): CommentResponseDto[] {
    config.reactionComments = config.reactionComments || [];
    return config.comments.map((comment: Comment) => {
      const isLike = !!config.reactionComments.find((reactionComment) => reactionComment.commentId === comment.id);

      return CommentResponseDto.of({
        comment,
        writer: comment.writer,
        isLike,
        isSelf: config.userId === comment.writerId,
        isAnonymous: config.isAnonymous,
      });
    });
  }
}
