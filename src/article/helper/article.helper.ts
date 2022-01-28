import { Comment } from '@root/comment/entities/comment.entity';
import { ReactionComment } from '@root/reaction/entities/reaction-comment.entity';

export const articleCommentsHelper = (
  comments: Comment[],
  reactionComments: ReactionComment[],
) => {
  return comments.map((comment) =>
    reactionComments.find(
      (reactionComment) => reactionComment.commentId === comment.id,
    )
      ? { ...comment, isLike: true }
      : { ...comment, isLike: false },
  );
};
