import { ArticleModule } from '@api/article/article.module';
import { ArticleRepository } from '@api/article/repositories/article.repository';
import { AuthModule } from '@api/auth/auth.module';
import { AuthService } from '@api/auth/auth.service';
import { CategoryModule } from '@api/category/category.module';
import { CategoryRepository } from '@api/category/repositories/category.repository';
import { SearchModule } from '@api/search/search.module';
import { UserRepository } from '@api/user/repositories/user.repository';
import { UserModule } from '@api/user/user.module';
import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { TestBaseModule } from './test.base.module';
import * as dummy from './utils/dummy';
import { clearDB, createTestApp } from './utils/utils';

describe('Search', () => {
  let httpServer: INestApplication;
  let userRepository: UserRepository;
  let articleRepository: ArticleRepository;
  let categoryRepository: CategoryRepository;
  let authService: AuthService;
  let JWT: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TestBaseModule,
        UserModule,
        AuthModule,
        ArticleModule,
        CategoryModule,
        SearchModule,
      ],
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

  describe('/reactions/articles/{articleId}/comments/{commentId}', () => {
    beforeEach(async () => {
      const user = dummy.user(
        'token',
        'nickname',
        'githubUsername',
        UserRole.CADET,
      );
      await userRepository.save(user);
      const category = dummy.category('category');
      await categoryRepository.save(category);
      const article = dummy.article(category.id, user.id, 'title', 'content');
      await articleRepository.save(article);
      JWT = dummy.jwt(user.id, user.role, authService);
    });

    test('[성공] GET - 게시글이 없는 경우', async () => {
      const response = await request(httpServer)
        .get('/search')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(HttpStatus.OK);
    });
  });
});
