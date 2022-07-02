import { ArticleModule } from '@api/article/article.module';
import { ArticleRepository } from '@api/article/repositories/article.repository';
import { AuthModule } from '@api/auth/auth.module';
import { AuthService } from '@api/auth/auth.service';
import { CategoryModule } from '@api/category/category.module';
import { CategoryRepository } from '@api/category/repositories/category.repository';
import { CommentModule } from '@api/comment/comment.module';
import { CommentRepository } from '@api/comment/repositories/comment.repository';
import { ReactionModule } from '@api/reaction/reaction.module';
import { UserRepository } from '@api/user/repositories/user.repository';
import { UserModule } from '@api/user/user.module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { E2eTestBaseModule } from './e2e-test.base.module';
import * as dummy from './utils/dummy';
import { clearDB, createTestApp } from './utils/utils';

describe('Reaction', () => {
  let httpServer: INestApplication;
  let userRepository: UserRepository;
  let articleRepository: ArticleRepository;
  let categoryRepository: CategoryRepository;
  let commentRepository: CommentRepository;
  let authService: AuthService;
  let JWT: string;
  let users: dummy.DummyUsers;
  let categories: dummy.DummyCategories;
  let articles: dummy.DummyArticles;

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
      ],
    }).compile();

    const app = createTestApp(moduleFixture);
    await app.init();

    userRepository = moduleFixture.get(UserRepository);
    articleRepository = moduleFixture.get(ArticleRepository);
    categoryRepository = moduleFixture.get(CategoryRepository);
    commentRepository = moduleFixture.get(CommentRepository);
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

  describe('/reactions/articles/{id}', () => {
    beforeEach(async () => {
      users = await dummy.createDummyUsers(userRepository);
      const user = users.cadet[0];
      JWT = dummy.jwt(user, authService);
      categories = await dummy.createDummyCategories(categoryRepository);
      await dummy.createDummyArticles(articleRepository, users, categories);
    });

    test('[성공] POST - 좋아요가 없는 경우', async () => {
      const response = await request(httpServer)
        .post('/reactions/articles/1')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(HttpStatus.OK);
      expect(response.body.isLike).toEqual(true);
      expect(response.body.likeCount).toEqual(1);
    });

    test('[성공] POST - 좋아요가 있는 경우', async () => {
      await request(httpServer).post('/reactions/articles/1').set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      const response2 = await request(httpServer)
        .post('/reactions/articles/1')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response2.status).toEqual(HttpStatus.OK);
      expect(response2.body.isLike).toEqual(false);
      expect(response2.body.likeCount).toEqual(0);
    });

    test('[실패] POST - unauthorize', async () => {
      const response = await request(httpServer).post('/reactions/articles/1');

      expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    // TODO: 여기 테스트 기능 구현할것
    test.skip('[성공] POST - 권한 높은 유저가 좋아요 하는 경우', async () => {
      expect(1).toEqual(1);
    });

    // TODO: 여기 테스트 기능 구현할것
    test.skip('[실패] POST - 권한 낮은 유저가 좋아요 하는 경우', async () => {
      expect(1).toEqual(1);
    });

    test('[실패] POST - 없는 id를 보내는 경우', async () => {
      const notExistId = 0;

      const response = await request(httpServer)
        .post('/reactions/articles/' + notExistId)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    });
  });

  describe('/reactions/articles/{articleId}/comments/{commentId}', () => {
    beforeEach(async () => {
      users = await dummy.createDummyUsers(userRepository);
      const user = users.cadet[0];
      JWT = dummy.jwt(user, authService);
      categories = await dummy.createDummyCategories(categoryRepository);
      articles = await dummy.createDummyArticles(articleRepository, users, categories);
      await dummy.createDummyComments(commentRepository, users, articles);
    });

    test('[성공] POST - 좋아요가 없는 경우', async () => {
      const response = await request(httpServer)
        .post('/reactions/articles/1/comments/1')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(HttpStatus.OK);
      expect(response.body.isLike).toEqual(true);
      expect(response.body.likeCount).toEqual(1);
    });

    test('[성공] POST - 좋아요가 있는 경우', async () => {
      await request(httpServer)
        .post('/reactions/articles/1/comments/1')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      const response2 = await request(httpServer)
        .post('/reactions/articles/1/comments/1')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response2.status).toEqual(HttpStatus.OK);
      expect(response2.body.isLike).toEqual(false);
      expect(response2.body.likeCount).toEqual(0);
    });

    test('[실패] POST - unauthorize', async () => {
      const response = await request(httpServer).post('/reactions/articles/1/comments/1');

      expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    // TODO: 여기 테스트 기능 구현할것
    test.skip('[성공] POST - 권한 높은 유저가 좋아요 하는 경우', async () => {
      expect(1).toEqual(1);
    });

    // TODO: 여기 테스트 기능 구현할것
    test.skip('[실패] POST - 권한 낮은 유저가 좋아요 하는 경우', async () => {
      expect(1).toEqual(1);
    });

    test('[실패] POST - 없는 articleId를 보내는 경우', async () => {
      const notExistId = 999;

      const response = await request(httpServer)
        .post('/reactions/articles/' + notExistId + '/comments/1')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    });

    test('[실패] POST - 없는 commentId를 보내는 경우', async () => {
      const notExistId = 0;

      const response = await request(httpServer)
        .post('/reactions/articles/1/comments/' + notExistId)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    });
  });
});
