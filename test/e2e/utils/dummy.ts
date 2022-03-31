import { Article } from '@article/entities/article.entity';
import { AuthService } from '@auth/auth.service';
import { JWTPayload } from '@auth/interfaces/jwt-payload.interface';
import { Category } from '@category/entities/category.entity';
import { Comment } from '@comment/entities/comment.entity';
import { UserRole } from '@root/user/interfaces/userrole.interface';
import { User } from '@user/entities/user.entity';
import { ReactionArticle } from '@root/reaction/entities/reaction-article.entity';
import { UserRepository } from '@root/user/repositories/user.repository';
import { CategoryRepository } from '@root/category/repositories/category.repository';

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
