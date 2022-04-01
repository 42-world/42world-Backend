import { Article } from '@article/entities/article.entity';
import { AuthService } from '@auth/auth.service';
import { JWTPayload } from '@auth/interfaces/jwt-payload.interface';
import { Category } from '@category/entities/category.entity';
import { Comment } from '@comment/entities/comment.entity';
import { Notification } from '@root/notification/entities/notification.entity';
import { NotificationType } from '@root/notification/interfaces/notifiaction.interface';
import { ReactionArticle } from '@root/reaction/entities/reaction-article.entity';
import { UserRole } from '@root/user/interfaces/userrole.interface';
import { User } from '@user/entities/user.entity';

export const user = (
  githubUid: string,
  nickname: string,
  githubUsername: string,
  role: UserRole,
): User => {
  const user = new User();
  user.githubUid = githubUid;
  user.nickname = nickname;
  user.githubUsername = githubUsername;
  user.role = role;
  return user;
};

export const jwt = (
  userId: number,
  role: string,
  authService: AuthService,
): string => {
  return authService.getJWT({
    userId: userId,
    userRole: role,
  } as JWTPayload);
};

export const category = (name: string) => {
  const category = new Category();
  category.name = name;
  return category;
};

export const article = (
  categoryId: number,
  writerId: number,
  title: string,
  content: string,
): Article => {
  const article = new Article();
  article.title = title;
  article.content = content;
  article.categoryId = categoryId;
  article.writerId = writerId;
  return article;
};

export const comment = (
  userId: number,
  articleId: number,
  content: string,
): Comment => {
  const comment = new Comment();
  comment.content = content;
  comment.writerId = userId;
  comment.articleId = articleId;
  return comment;
};

export const reactionArticle = (
  articleId: number,
  userId: number,
): ReactionArticle => {
  const reactionArticle = new ReactionArticle();
  reactionArticle.articleId = articleId;
  reactionArticle.userId = userId;
  return reactionArticle;
};

export const notification = (
  type: NotificationType,
  userId: number,
  articleId: number,
  content: string,
): Notification => {
  const notification = new Notification();
  notification.type = type;
  notification.content = content;
  notification.userId = userId;
  notification.articleId = articleId;
  return notification;
};
