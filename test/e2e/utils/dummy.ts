import { Comment } from '@comment/entities/comment.entity';

export const comment = (userId: number, articleId: number) => {
  const comment = new Comment();
  comment.content = 'cc';
  comment.writerId = userId;
  comment.articleId = articleId;
  return comment;
};
