import { ArticleModule } from '@api/article/article.module';
import { ArticleRepository } from '@api/article/repositories/article.repository';
import { AuthModule } from '@api/auth/auth.module';
import { AuthService } from '@api/auth/auth.service';
import { CategoryModule } from '@api/category/category.module';
import { CategoryRepository } from '@api/category/repositories/category.repository';
import { SearchModule } from '@api/search/search.module';
import { UserRepository } from '@api/user/repositories/user.repository';
import { UserModule } from '@api/user/user.module';
import { Article } from '@app/entity/article/article.entity';
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

  // 전체 게시판 검색 api
  describe('/search?q={word}', () => {
    let user;
    let category1;
    let category2;
    const searchWord = '42';
    const titleWithSearchWord = 'aaa42aaa';
    const titleWithoutSearchWord = 'aaaaaa';
    const contentWithSearchWord = 'bbb42bbb';
    const contentWithoutSearchWord = 'bbbbbb';
    const searchAllRequestDto = {
      q: searchWord,
    };

    beforeEach(async () => {
      user = dummy.user('token', 'nickname', 'githubUsername', UserRole.CADET);
      await userRepository.save(user);
      category1 = dummy.category('category1');
      await categoryRepository.save(category1);
      category2 = dummy.category('category2');
      await categoryRepository.save(category2);
      JWT = dummy.jwt(user.id, user.role, authService);
    });

    test.only('[성공] GET - 게시글이 없는 경우', async () => {
      const response = await request(httpServer)
        .get('/search')
        .query(searchAllRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      console.log(response);
      expect(response.status).toEqual(HttpStatus.OK);
      const responseArticles = response.body.data as Article[];
      expect(responseArticles.length).toBe(0);
    });

    test('[성공] GET - 일치하는 글이 없는 경우', async () => {
      await articleRepository.save(
        dummy.article(
          category1.id,
          user.id,
          titleWithoutSearchWord,
          contentWithoutSearchWord,
        ),
      );
      await articleRepository.save(
        dummy.article(
          category2.id,
          user.id,
          titleWithoutSearchWord,
          contentWithoutSearchWord,
        ),
      );

      const response = await request(httpServer)
        .get('/search')
        .query(searchAllRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(HttpStatus.OK);
      const responseArticles = response.body.data as Article[];
      expect(responseArticles.length).toBe(0);
    });

    test('[성공] GET - 제목이 일치하는 경우', async () => {
      await articleRepository.save(
        dummy.article(
          category1.id,
          user.id,
          titleWithSearchWord,
          contentWithoutSearchWord,
        ),
      );
      await articleRepository.save(
        dummy.article(
          category2.id,
          user.id,
          titleWithSearchWord,
          contentWithoutSearchWord,
        ),
      );

      const response = await request(httpServer)
        .get('/search')
        .query(searchAllRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(HttpStatus.OK);
      const responseArticles = response.body.data as Article[];
      expect(responseArticles.length).toBe(2);
      expect(responseArticles[0].title).toBe(titleWithSearchWord);
      expect(responseArticles[1].title).toBe(titleWithSearchWord);
    });

    test('[성공] GET - 내용이 일치하는 경우', async () => {
      await articleRepository.save(
        dummy.article(
          category1.id,
          user.id,
          titleWithoutSearchWord,
          contentWithSearchWord,
        ),
      );
      await articleRepository.save(
        dummy.article(
          category2.id,
          user.id,
          titleWithoutSearchWord,
          contentWithSearchWord,
        ),
      );

      const response = await request(httpServer)
        .get('/search')
        .query(searchAllRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(HttpStatus.OK);
      const responseArticles = response.body.data as Article[];
      expect(responseArticles.length).toBe(2);
      expect(responseArticles[0].content).toBe(contentWithSearchWord);
      expect(responseArticles[1].content).toBe(contentWithSearchWord);
    });
  });
});
