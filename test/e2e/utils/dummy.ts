import { Article } from '@article/entities/article.entity';
import { AuthService } from '@auth/auth.service';
import { JWTPayload } from '@auth/interfaces/jwt-payload.interface';
import { Category } from '@category/entities/category.entity';
import { Comment } from '@comment/entities/comment.entity';
import { User, UserRole } from '@user/entities/user.entity';

export const user = (
  oauthToken: string,
  nickname: string,
  role: UserRole,
): User => {
  const newUser2 = new User();
  newUser2.oauthToken = oauthToken;
  newUser2.nickname = nickname;
  newUser2.role = role;
  return newUser2;
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
