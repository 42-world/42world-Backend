import { AuthService } from '@api/auth/auth.service';
import { JWTPayload } from '@api/auth/interfaces/jwt-payload.interface';
import { CategoryRepository } from '@api/category/repositories/category.repository';
import { UserRepository } from '@api/user/repositories/user.repository';
import { Article } from '@app/entity/article/article.entity';
import { Category } from '@app/entity/category/category.entity';
import { Comment } from '@app/entity/comment/comment.entity';
import { NotificationType } from '@app/entity/notification/interfaces/notifiaction.interface';
import { Notification } from '@app/entity/notification/notification.entity';
import { ReactionArticle } from '@app/entity/reaction/reaction-article.entity';
import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { User } from '@app/entity/user/user.entity';

export const user = (
  githubUid: string,
  nickname: string,
  githubUsername: string,
  role: UserRole,
  character = 0,
): User => {
  const user = new User();
  user.githubUid = githubUid;
  user.nickname = nickname;
  user.githubUsername = githubUsername;
  user.character = character;
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

export const category = (
  name: string,
  commonRole: UserRole = UserRole.CADET,
  anonymity = false,
) => {
  const category = new Category();
  category.name = name;
  category.readableArticle = commonRole;
  category.writableArticle = commonRole;
  category.readableComment = commonRole;
  category.writableComment = commonRole;
  category.reactionable = commonRole;
  category.anonymity = anonymity;
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

export type DummyUsers = {
  cadet: User[];
  admin: User[];
  novice: User[];
};

export const createDummyUsers = async (
  userRepository: UserRepository,
): Promise<DummyUsers> => {
  const dummyUsers: DummyUsers = {
    cadet: await userRepository.save([
      user('uid1', 'name1', 'githubName1', UserRole.CADET),
      user('uid2', 'name2', 'githubName2', UserRole.CADET),
    ]),
    admin: await userRepository.save([
      user('uid3', 'name3', 'githubName3', UserRole.ADMIN),
      user('uid4', 'name4', 'githubName4', UserRole.ADMIN),
    ]),
    novice: await userRepository.save([
      user('uid5', 'name5', 'githubName5', UserRole.NOVICE),
      user('uid6', 'name6', 'githubName6', UserRole.NOVICE),
    ]),
  };

  return dummyUsers;
};

export type DummyCategories = {
  free: Category;
  notice: Category;
  forall: Category;
  anony: Category;
};

export const createDummyCategories = async (
  categoryRepository: CategoryRepository,
): Promise<DummyCategories> => {
  const dummyCategories: DummyCategories = {
    free: await categoryRepository.save(
      category('free category', UserRole.CADET),
    ),
    notice: await categoryRepository.save(
      category('notice category', UserRole.ADMIN),
    ),
    forall: await categoryRepository.save(
      category('forall category', UserRole.NOVICE),
    ),
    anony: await categoryRepository.save(
      category('anony category', UserRole.CADET, true),
    ),
  };

  return dummyCategories;
};

export const jwt2 = (user: User, authService: AuthService): string => {
  return authService.getJWT({
    userId: user.id,
    userRole: user.role,
  } as JWTPayload);
};
