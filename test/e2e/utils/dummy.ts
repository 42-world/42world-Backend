import { Article } from '@article/entities/article.entity';
import { AuthService } from '@auth/auth.service';
import { JWTPayload } from '@auth/interfaces/jwt-payload.interface';
import { Category } from '@category/entities/category.entity';
import { Comment } from '@comment/entities/comment.entity';
import { UserRole } from '@root/user/interfaces/userrole.interface';
import { User } from '@user/entities/user.entity';

export const user = (
  oauthToken: string,
  nickname: string,
  role: UserRole,
): User => {
  const user = new User();
  user.oauthToken = oauthToken;
  user.nickname = nickname;
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