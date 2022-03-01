import { Comment } from '@root/comment/entities/comment.entity';
import { PageDto } from '@root/pagination/dto/pagination.dto';
import { ReactionComment } from '@root/reaction/entities/reaction-comment.entity';
import { DetailCommentDto } from '../dto/detail-comment.dto';

export const articleCommentsHelper = (
  comments: PageDto<Comment>,
  reactionComments: ReactionComment[],
) => {
  const data = comments.data;

  const likeData = data.map((comment) =>
    reactionComments.find(
      (reactionComment) => reactionComment.commentId === comment.id,
    )
      ? { ...comment, isLike: true }
      : { ...comment, isLike: false },
  ) as DetailCommentDto[];

  return new PageDto(likeData, comments.meta);
};
