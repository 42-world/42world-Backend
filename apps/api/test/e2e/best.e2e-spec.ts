import { ArticleModule } from '@api/article/article.module';
import { ArticleRepository } from '@api/article/repositories/article.repository';
import { AuthModule } from '@api/auth/auth.module';
import { AuthService } from '@api/auth/auth.service';
import { BestModule } from '@api/best/best.module';
import { CategoryModule } from '@api/category/category.module';
import { CategoryRepository } from '@api/category/repositories/category.repository';
import { UserRepository } from '@api/user/repositories/user.repository';
import { UserModule } from '@api/user/user.module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { E2eTestBaseModule } from '@test/e2e/e2e-test.base.module';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import * as dummy from './utils/dummy';
import { clearDB, createTestApp } from './utils/utils';

describe('Best', () => {
  let httpServer: INestApplication;

  let userRepository: UserRepository;
  let articleRepository: ArticleRepository;
  let categoryRepository: CategoryRepository;

  let authService: AuthService;
  let JWT: string;

  let users: dummy.DummyUsers;
  let categories: dummy.DummyCategories;
  let articles: dummy.DummyArticles;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [E2eTestBaseModule, UserModule, AuthModule, ArticleModule, CategoryModule, BestModule],
    }).compile();

    const app = createTestApp(moduleFixture);
    await app.init();

    userRepository = moduleFixture.get(UserRepository);
    articleRepository = moduleFixture.get(ArticleRepository);
    categoryRepository = moduleFixture.get(CategoryRepository);
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

  describe('/best', () => {
    beforeEach(async () => {
      users = await dummy.createDummyUsers(userRepository);
      categories = await dummy.createDummyCategories(categoryRepository);
      articles = await dummy.createDummyArticles(articleRepository, users, categories);
      JWT = dummy.jwt(users.cadet[0], authService);
    });

    test('[성공] GET - 인기글 가져오기', async () => {
      const response = await request(httpServer).get('/best').set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toEqual(HttpStatus.OK);
      expect(response.body.length).toEqual(Object.keys(articles).length - 1);
      expect(response.body[0].title).toEqual(articles.best.title);
      expect(response.body[0].content).toEqual(articles.best.content);
    });
  });
});
