import { ArticleModule } from '@api/article/article.module';
import { ArticleRepository } from '@api/article/repositories/article.repository';
import { AuthModule } from '@api/auth/auth.module';
import { AuthService } from '@api/auth/auth.service';
import { CategoryModule } from '@api/category/category.module';
import { CategoryRepository } from '@api/category/repositories/category.repository';
import { CommentModule } from '@api/comment/comment.module';
import { CommentRepository } from '@api/comment/repositories/comment.repository';
import { ReactionModule } from '@api/reaction/reaction.module';
import { ReactionArticleRepository } from '@api/reaction/repositories/reaction-article.repository';
import { UpdateUserProfileRequestDto } from '@api/user/dto/request/update-user-profile-request.dto';
import { UserProfileResponseDto } from '@api/user/dto/response/user-profile-response.dto';
import { UserResponseDto } from '@api/user/dto/response/user-response.dto';
import { UserRepository } from '@api/user/repositories/user.repository';
import { UserModule } from '@api/user/user.module';
import { Article } from '@app/entity/article/article.entity';
import { Comment } from '@app/entity/comment/comment.entity';
import { IntraAuth } from '@app/entity/intra-auth/intra-auth.entity';
import { ReactionArticle } from '@app/entity/reaction/reaction-article.entity';
import { User } from '@app/entity/user/user.entity';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import * as dummy from '@test/e2e/utils/dummy';
import { clearDB, createTestApp } from '@test/e2e/utils/utils';
import * as request from 'supertest';
import { getConnection, Repository } from 'typeorm';
import { E2eTestBaseModule } from './e2e-test.base.module';

describe('User', () => {
  let httpServer: INestApplication;

  let userRepository: UserRepository;
  let articleRepository: ArticleRepository;
  let categoryRepository: CategoryRepository;
  let commentRepository: CommentRepository;
  let reactionArticleRepository: ReactionArticleRepository;
  let intraAuthRepository: Repository<IntraAuth>;
  let authService: AuthService;
  let JWT: string;

  let users: dummy.DummyUsers;
  let categories: dummy.DummyCategories;
  let articles: dummy.DummyArticles;
  let comments: dummy.DummyComments;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        E2eTestBaseModule,
        UserModule,
        AuthModule,
        ArticleModule,
        CategoryModule,
        CommentModule,
        ReactionModule,
        TypeOrmModule.forFeature([IntraAuth]),
      ],
    }).compile();

    const app = createTestApp(moduleFixture);
    await app.init();

    userRepository = moduleFixture.get(UserRepository);
    articleRepository = moduleFixture.get(ArticleRepository);
    categoryRepository = moduleFixture.get(CategoryRepository);
    commentRepository = moduleFixture.get(CommentRepository);
    reactionArticleRepository = moduleFixture.get(ReactionArticleRepository);
    intraAuthRepository = moduleFixture.get(getRepositoryToken(IntraAuth));
    authService = moduleFixture.get(AuthService);

    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    await getConnection().close();
    await httpServer.close();
  });

  beforeEach(async () => {
    await clearDB();
  });

  describe('/users/me', () => {
    const intraId = 'chlim';
    let user: User;
    beforeEach(async () => {
      users = await dummy.createDummyUsers(userRepository);
      user = users.cadet[0];

      const intraAuth = new IntraAuth();
      intraAuth.userId = user.id;
      intraAuth.intraId = intraId;
      await intraAuthRepository.save(intraAuth);
      JWT = dummy.jwt(user, authService);
    });

    //TODO: user 정보 확인 추가
    test('[성공] GET - 내 정보 가져오기', async () => {
      const response = await request(httpServer)
        .get('/users/me')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      const userProfileResponse = response.body as UserProfileResponseDto;

      expect(response.status).toEqual(HttpStatus.OK);
      expect(userProfileResponse.id).toEqual(user.id);
      expect(userProfileResponse.nickname).toEqual(user.nickname);
      expect(userProfileResponse.role).toEqual(user.role);
      expect(userProfileResponse.character).toEqual(user.character);
      expect(userProfileResponse.intraId).toEqual(intraId);
    });
  });

  describe('/users/{id}', () => {
    let user: User;
    beforeEach(async () => {
      users = await dummy.createDummyUsers(userRepository);
      user = users.cadet[0];
      JWT = dummy.jwt(user, authService);
    });

    test('[성공] GET - 특정 유저 정보 가져오기', async () => {
      const response = await request(httpServer)
        .get(`/users/${user.id}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(HttpStatus.OK);
      const userResponse = response.body as UserResponseDto;
      expect(userResponse.id).toEqual(user.id);
      expect(userResponse.nickname).toEqual(user.nickname);
      expect(userResponse.role).toEqual(user.role);
      expect(userResponse.character).toEqual(user.character);
    });

    test('[실패] GET - 없는 유저 id를 요청한 경우', async () => {
      const response = await request(httpServer)
        .get(`/users/${999}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      // TODO - 스웨거에 반영하기
      expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    });
  });

  describe('/users', () => {
    let user: User;
    let user2: User;
    const updatedNickname = 'updated nickname';
    const updatedCharacter = 2;

    beforeEach(async () => {
      users = await dummy.createDummyUsers(userRepository);
      user = users.cadet[0];
      user2 = users.cadet[1];
      JWT = dummy.jwt(user, authService);
    });

    test('[성공] PUT - 유저 프로필 변경', async () => {
      const updateData = {
        nickname: updatedNickname,
        character: updatedCharacter,
      } as UpdateUserProfileRequestDto;
      const response = await request(httpServer)
        .put('/users')
        .send(updateData)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(HttpStatus.OK);

      const updatedUser = await userRepository.findOne(user.id);
      expect(updatedUser.nickname).toEqual(updatedNickname);
      expect(updatedUser.character).toEqual(updatedCharacter);
    });

    test('[성공] PUT - 중복된 닉네임인 경우', async () => {
      // nickname2는 유저2의 닉네임이다
      const updateData = {
        nickname: user2.nickname,
        character: updatedCharacter,
      } as UpdateUserProfileRequestDto;
      const response = await request(httpServer)
        .put('/users')
        .send(updateData)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(HttpStatus.OK);

      const updatedUser = await userRepository.findOne(user.id);
      expect(updatedUser.nickname).toEqual(user2.nickname);
      expect(updatedUser.character).toEqual(updatedCharacter);
    });

    // TODO - 로직 수정
    test.skip('[성공] PUT - 닉네임 길이가 0인 경우', async () => {
      const updateData = {
        nickname: '',
        character: updatedCharacter,
      } as UpdateUserProfileRequestDto;
      const response = await request(httpServer)
        .put('/users')
        .send(updateData)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    test('[성공] PUT - 닉네임만 변경하는 경우', async () => {
      const updateData = {
        nickname: updatedNickname,
      } as UpdateUserProfileRequestDto;
      const response = await request(httpServer)
        .put('/users')
        .send(updateData)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(HttpStatus.OK);

      const updatedUser = await userRepository.findOne(user.id);
      expect(updatedUser.nickname).toEqual(updatedNickname);
      expect(updatedUser.character).toEqual(user.character);
    });

    test('[성공] PUT - 캐릭터만 변경하는 경우', async () => {
      const updateData = {
        character: updatedCharacter,
      } as UpdateUserProfileRequestDto;
      const response = await request(httpServer)
        .put('/users')
        .send(updateData)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(HttpStatus.OK);

      const updatedUser = await userRepository.findOne(user.id);
      expect(updatedUser.nickname).toEqual(user.nickname);
      expect(updatedUser.character).toEqual(updatedCharacter);
    });

    test('[실패] PUT - 없는 캐릭터 번호', async () => {
      const updateData = {
        nickname: updatedNickname,
        character: 999,
      } as UpdateUserProfileRequestDto;
      const response = await request(httpServer)
        .put('/users')
        .send(updateData)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(HttpStatus.BAD_REQUEST);

      const updatedUser = await userRepository.findOne(user.id);
      expect(updatedUser.nickname).toEqual(user.nickname);
      expect(updatedUser.character).toEqual(user.character);
    });

    test('[성공] DELETE - 유저 삭제하기', async () => {
      const response = await request(httpServer)
        .delete('/users')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(HttpStatus.OK);

      const deletedUser = await userRepository.findOne(user.id, {
        withDeleted: true,
      });

      expect(deletedUser.deletedAt).toBeTruthy();
    });
  });

  describe('/users/me/articles', () => {
    let user: User;
    let article: Article;

    beforeEach(async () => {
      users = await dummy.createDummyUsers(userRepository);
      user = users.cadet[0];
      JWT = dummy.jwt(user, authService);

      categories = await dummy.createDummyCategories(categoryRepository);
      articles = await dummy.createDummyArticles(articleRepository, users, categories);
      article = articles.first;
    });

    test('[성공] GET - 내가 작성한 글 가져오기', async () => {
      const response = await request(httpServer)
        .get('/users/me/articles')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(HttpStatus.OK);

      const articles = response.body.data as Article[];

      expect(articles[0].title).toEqual(article.title);
      // expect(articles[0].category.id).toEqual(article.category.id);
      // expect(articles[0].writer.id).toEqual(article.writer.id);
      // expect(articles[0].writer.nickname).toEqual(article.writer.nickname);
    });

    test.skip('[성공] GET - 내가 작성한 글 가져오기 - 익명', async () => {
      expect(1).toBeTruthy();
    });
  });

  describe('/users/me/comments', () => {
    let user: User;
    let comment: Comment;

    beforeEach(async () => {
      users = await dummy.createDummyUsers(userRepository);
      user = users.cadet[0];
      JWT = dummy.jwt(user, authService);

      categories = await dummy.createDummyCategories(categoryRepository);
      articles = await dummy.createDummyArticles(articleRepository, users, categories);
      comments = await dummy.createDummyComments(commentRepository, users, articles);
      comment = comments.first;
    });

    test('[성공] GET - 내가 작성한 댓글 가져오기', async () => {
      const response = await request(httpServer)
        .get('/users/me/comments')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(HttpStatus.OK);

      const comments = response.body.data as Comment[];

      expect(comments.length).toEqual(2);
      expect(comments[1].content).toEqual(comment.content);
    });

    test('[성공] - GET - 내가 작성한 댓글 가져오기, 삭제한 게시글이 있는 경우', async () => {
      await articleRepository.softDelete(articles.first);

      const response = await request(httpServer)
        .get('/users/me/comments')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(HttpStatus.OK);

      const responseComments = response.body.data as Comment[];

      expect(responseComments.length).toEqual(1);
      expect(responseComments[0].id).toEqual(comments.anotherFirst.id);
      expect(responseComments[0].content).toEqual(comments.anotherFirst.content);
    });

    test.skip('[성공] GET - 내가 작성한 댓글 가져오기 - 익명', async () => {
      expect(1).toBeTruthy();
    });
  });

  describe('/users/me/like-articles', () => {
    let user: User;
    let article: Article;
    let reactionArticle: ReactionArticle;

    beforeEach(async () => {
      users = await dummy.createDummyUsers(userRepository);
      user = users.cadet[0];
      JWT = dummy.jwt(user, authService);

      categories = await dummy.createDummyCategories(categoryRepository);
      articles = await dummy.createDummyArticles(articleRepository, users, categories);
      article = articles.first;
      await dummy.createDummyComments(commentRepository, users, articles);
      reactionArticle = dummy.reactionArticle(article.id, user.id);
      await reactionArticleRepository.save(reactionArticle);
    });

    test('[성공] GET - 내가 좋아요 누른 게시글 목록 확인', async () => {
      const response = await request(httpServer)
        .get('/users/me/like-articles')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(HttpStatus.OK);

      const articles = response.body.data as Article[];

      expect(articles.length).toEqual(1);
      expect(articles[0].id).toEqual(reactionArticle.id);
    });

    test('[성공] - GET - 내가 좋아요 누른 게시글 가져오기, 삭제한 게시글이 있는 경우', async () => {
      await articleRepository.softDelete(articles.first);

      const response = await request(httpServer)
        .get('/users/me/like-articles')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(HttpStatus.OK);

      const responseArticle = response.body.data as Article[];

      expect(responseArticle.length).toEqual(0);
    });

    test.skip('[성공] GET - 내가 좋아요 누른 게시글 목록 확인 - 익명', async () => {
      expect(1).toBeTruthy();
    });
  });
});
