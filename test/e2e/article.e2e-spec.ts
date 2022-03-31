import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import * as cookieParser from 'cookie-parser';

import { AuthModule } from '@auth/auth.module';
import { UserModule } from '@user/user.module';
import { UserRepository } from '@user/repositories/user.repository';
import { AuthService } from '@auth/auth.service';
import { TypeormExceptionFilter } from '@root/filters/typeorm-exception.filter';
import { ArticleModule } from '@article/article.module';
import { ArticleRepository } from '@article/repositories/article.repository';
import { Article } from '@article/entities/article.entity';
import { CategoryModule } from '@category/category.module';
import { CategoryRepository } from '@category/repositories/category.repository';
import { CommentModule } from '@comment/comment.module';
import { ReactionModule } from '@root/reaction/reaction.module';
import { CreateArticleRequestDto } from '@root/article/dto/request/create-article-request.dto';
import { FindAllArticleRequestDto } from '@root/article/dto/request/find-all-article-request.dto';
import { UpdateArticleRequestDto } from '@root/article/dto/request/update-article-request.dto';

import { TestBaseModule } from './test.base.module';
import * as dummy from './utils/dummy';
import { clearDB, createTestApp } from './utils/utils';
import { testDto } from './utils/validate-test';
import { CreateArticleResponseDto } from '@root/article/dto/response/create-article-response.dto';
import { FindOneArticleResponseDto } from '@root/article/dto/response/find-one-article-response.dto';

/*
테스트 짜는 순서
1. 정상적인 시나리오대로 성공 케이스 작성
2. 권한 관련해서 실패 케이스 작성
3. 400을 제회의한 의도적인 예외처리 관련해서 실패 케이스 작성
4. dto 에서 날수있는 예외처리 관련해서 실패 케이스 작성

성공 케이스는 응답값 다 잘 있는지 확인할것
실패 케이스는 상태코드만 확인할것
*/

/**
 * test module 유틸로 빼기
 * HttpStatus.INTERNAL_SERVER_ERROR 쓸것
 * 더미 데이터 어떻게 할지 고민해볼것
 * response dto 가 제대로 확인되고있는지 체크할것
 * unauthenticated 에러가 잘 나오는지 확인할것
 */

describe('Article', () => {
  let httpServer: INestApplication;

  let userRepository: UserRepository;
  let articleRepository: ArticleRepository;
  let categoryRepository: CategoryRepository;

  let authService: AuthService;
  let JWT: string;

  let users: dummy.DummyUsers;
  let categories: dummy.DummyCategories;
  let articles: Article[];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TestBaseModule,
        UserModule,
        AuthModule,
        ArticleModule,
        CategoryModule,
        CommentModule,
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

  describe('/articles', () => {
    beforeEach(async () => {
      users = await dummy.createDummyUsers(userRepository);
      categories = await dummy.createDummyCategories(categoryRepository);
      articles = await articleRepository.save([
        dummy.article(categories.free.id, users.cadet[0].id, 'title1', 'text1'),
        dummy.article(categories.free.id, users.cadet[0].id, 'title2', 'text2'),
      ]);
      JWT = dummy.jwt2(users.cadet[0], authService);
    });

    test('[성공] POST - 글쓰기', async () => {
      const createArticlRequesteDto: CreateArticleRequestDto = {
        title: 'test title',
        content: 'test content',
        categoryId: categories.free.id,
      };

      const response = await request(httpServer)
        .post('/articles')
        .send(createArticlRequesteDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toEqual(HttpStatus.CREATED);

      const result = response.body as CreateArticleResponseDto;
      expect(result.title).toBe(createArticlRequesteDto.title);
      expect(result.content).toBe(createArticlRequesteDto.content);
      expect(result.categoryId).toBe(createArticlRequesteDto.categoryId);
      expect(result.writerId).toBe(users.cadet[0].id);
      expect(result.viewCount).toBe(0);
      expect(result.likeCount).toBe(0);
      expect(result.commentCount).toBe(0);
    });

    test('[실패] POST - unauthorized', async () => {
      const response = await request(httpServer).post('/articles');

      expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    test('[성공] POST - 글쓰기 권한 높은사람', async () => {
      const createArticlRequesteDto: CreateArticleRequestDto = {
        title: 'test title',
        content: 'test content',
        categoryId: categories.free.id,
      };

      JWT = dummy.jwt2(users.admin[0], authService);
      const response = await request(httpServer)
        .post('/articles')
        .send(createArticlRequesteDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toEqual(HttpStatus.CREATED);
    });

    test('[실패] POST - 글쓰기 권한 낮은사람', async () => {
      const createArticlRequesteDto: CreateArticleRequestDto = {
        title: 'test title',
        content: 'test content',
        categoryId: categories.free.id,
      };

      JWT = dummy.jwt2(users.novice[0], authService);
      const response = await request(httpServer)
        .post('/articles')
        .send(createArticlRequesteDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toEqual(HttpStatus.NOT_ACCEPTABLE);
    });

    test('[실패] POST - 글쓰기 존재하지 않는 카테고리', async () => {
      const createArticlRequesteDto = {
        title: 'test title',
        content: 'test content',
        categoryId: 99,
      };

      const response = await request(httpServer)
        .post('/articles')
        .send(createArticlRequesteDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    testDto<CreateArticleRequestDto>([
      ['title', undefined],
      ['title', 123],
      ['title', 'a'.repeat(50), '42자를 넘김'],
      ['content', undefined],
      ['content', 123],
      ['content', 'a'.repeat(5000), '4242자를 넘김'],
      ['categoryId', undefined],
      ['categoryId', 'abc'],
      ['categoryId', -1],
    ])('[실패] POST - 글쓰기 dto의 %s인 경우', async (_, buildDto) => {
      const createArticlRequesteDto = buildDto({
        title: 'test title',
        content: 'test content',
        categoryId: categories.free.id,
      });

      const response = await request(httpServer)
        .post('/articles')
        .send(createArticlRequesteDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test('[성공] GET - 게시글 목록 조회', async () => {
      const findArticleRequestDto = {
        categoryId: categories.free.id,
      };

      const response = await request(httpServer)
        .get('/articles')
        .query(findArticleRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toEqual(HttpStatus.OK);

      const responseArticles = response.body.data as Article[];
      expect(responseArticles.length).toBe(2);
      expect(responseArticles[0].id).toBe(articles[1].id);
      expect(responseArticles[0].title).toBe(articles[1].title);
      expect(responseArticles[0].content).toBe(articles[1].content);
      expect(responseArticles[0].writerId).toBe(articles[1].writerId);
      expect(responseArticles[0].writer.id).toBe(articles[1].writerId);
      expect(responseArticles[0].writer.nickname).toBe(users.cadet[0].nickname);
      expect(responseArticles[0].viewCount).toBe(articles[1].viewCount);
      expect(responseArticles[0].likeCount).toBe(articles[1].likeCount);
      expect(responseArticles[0].commentCount).toBe(articles[1].commentCount);
      expect(responseArticles[0].categoryId).toBe(
        findArticleRequestDto.categoryId,
      );
      expect(responseArticles[1].id).toBe(articles[0].id);
      expect(responseArticles[1].categoryId).toBe(
        findArticleRequestDto.categoryId,
      );
    });

    test('[실패] GET - unauthorized', async () => {
      const response = await request(httpServer).get('/articles');

      expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    test('[성공] GET - 게시글 목록 조회 권한 높은사람', async () => {
      const findArticleRequestDto = {
        categoryId: categories.free.id,
      };

      JWT = dummy.jwt2(users.admin[0], authService);
      const response = await request(httpServer)
        .get('/articles')
        .query(findArticleRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toEqual(HttpStatus.OK);
    });

    test('[실패] GET - 게시글 목록 조회 권한 낮은사람', async () => {
      const findArticleRequestDto = {
        categoryId: categories.free.id,
      };

      JWT = dummy.jwt2(users.novice[0], authService);
      const response = await request(httpServer)
        .get('/articles')
        .query(findArticleRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toEqual(HttpStatus.NOT_ACCEPTABLE);
    });

    test('[실패] GET - 게시글 목록 조희 존재하지 않는 카테고리', async () => {
      const findArticleRequestDto = {
        categoryId: 99,
      };

      const response = await request(httpServer)
        .get('/articles')
        .query(findArticleRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    testDto<FindAllArticleRequestDto>([
      ['categoryId', 'abc'],
      ['categoryId', -1],
    ])('[실패] GET - 게시글 목록 조희 dto의 %s인 경우', async (_, buildDto) => {
      const findArticleRequestDto = buildDto({
        categoryId: categories.free.id,
      });

      const response = await request(httpServer)
        .get('/articles')
        .query(findArticleRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/articles/:id', () => {
    beforeEach(async () => {
      users = await dummy.createDummyUsers(userRepository);
      categories = await dummy.createDummyCategories(categoryRepository);
      articles = await articleRepository.save([
        dummy.article(categories.free.id, users.cadet[0].id, 'title1', 'text1'),
        dummy.article(categories.free.id, users.cadet[1].id, 'title1', 'text1'),
      ]);
      JWT = dummy.jwt2(users.cadet[0], authService);
    });

    test('[성공] GET - 게시글 상세 조회', async () => {
      const articleId = articles[0].id;

      const response = await request(httpServer)
        .get(`/articles/${articleId}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toEqual(HttpStatus.OK);

      const result = response.body as FindOneArticleResponseDto;
      expect(result.title).toBe(articles[0].title);
      expect(result.content).toBe(articles[0].content);
      expect(result.categoryId).toBe(articles[0].categoryId);
      expect(result.writerId).toBe(articles[0].writerId);
      expect(result.viewCount).toBe(0);
      expect(result.likeCount).toBe(0);
      expect(result.commentCount).toBe(0);
      expect(result.isLike).toBe(false);
      expect(result.category.id).toBe(categories.free.id);
      expect(result.category.name).toBe(categories.free.name);
      expect(result.writer.id).toBe(users.cadet[0].id);
      expect(result.writer.nickname).toBe(users.cadet[0].nickname);
    });

    test('[실패] GET - unauthorized', async () => {
      const articleId = articles[0].id;

      const response = await request(httpServer).get(`/articles/${articleId}`);

      expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    test('[성공] GET - 게시글 상세 조회 권한 높은사람', async () => {
      const articleId = articles[0].id;

      JWT = dummy.jwt2(users.admin[0], authService);
      const response = await request(httpServer)
        .get(`/articles/${articleId}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toEqual(HttpStatus.OK);
    });

    test('[실패] GET - 게시글 상세 조회 권한 낮은사람', async () => {
      const articleId = articles[0].id;

      JWT = dummy.jwt2(users.novice[0], authService);
      const response = await request(httpServer)
        .get(`/articles/${articleId}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toEqual(HttpStatus.NOT_ACCEPTABLE);
    });

    test('[실패] GET - 게시글 상세 조회 존재하지 않는 게시글', async () => {
      const articleId = 99;

      const response = await request(httpServer)
        .get(`/articles/${articleId}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    testDto<{ articleId: number }>([
      ['articleId', undefined],
      ['articleId', 'abc'],
    ])('[실패] GET - 게시글 상세 조회 %s인 경우', async (_, buildDto) => {
      const articleId = buildDto({
        articleId: articles[0].id,
      }).articleId;

      const response = await request(httpServer)
        .get(`/articles/${articleId}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test('[성공] PUT - 게시글 수정', async () => {
      const articleId = articles[0].id;
      const updateArticleRequestDto: UpdateArticleRequestDto = {
        title: 'title2',
        content: 'content2',
        categoryId: categories.free.id,
      };

      const response = await request(httpServer)
        .put(`/articles/${articleId}`)
        .send(updateArticleRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toEqual(HttpStatus.OK);

      const result = await articleRepository.findOne(articleId);
      expect(result.title).toBe(updateArticleRequestDto.title);
      expect(result.content).toBe(updateArticleRequestDto.content);
      expect(result.categoryId).toBe(updateArticleRequestDto.categoryId);
      expect(result.writerId).toBe(users.cadet[0].id);
    });

    test('[실패] PUT - unauthorized', async () => {
      const articleId = articles[0].id;

      const response = await request(httpServer).put(`/articles/${articleId}`);

      expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    test('[실패] PUT - 게시글 수정 내가 쓴글이 아닌경우', async () => {
      const articleId = articles[1].id;
      const updateArticleRequestDto: UpdateArticleRequestDto = {
        title: 'title2',
        content: 'content2',
        categoryId: categories.free.id,
      };

      const response = await request(httpServer)
        .put(`/articles/${articleId}`)
        .send(updateArticleRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toEqual(HttpStatus.NOT_FOUND);

      const result = await articleRepository.findOne(articleId);
      expect(result.title).toBe(articles[1].title);
      expect(result.content).toBe(articles[1].content);
      expect(result.categoryId).toBe(articles[1].categoryId);
    });

    test('[실패] PUT - 게시글 수정 존재하지 않는 게시글', async () => {
      const articleId = 99;
      const updateArticleRequestDto: UpdateArticleRequestDto = {
        title: 'title2',
        content: 'content2',
        categoryId: categories.free.id,
      };

      const response = await request(httpServer)
        .put(`/articles/${articleId}`)
        .send(updateArticleRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    test('[실패] PUT - 게시글 수정 존재하지 않는 카테고리', async () => {
      const articleId = articles[0].id;
      const updateArticleRequestDto: UpdateArticleRequestDto = {
        title: 'title2',
        content: 'content2',
        categoryId: 99,
      };

      const response = await request(httpServer)
        .put(`/articles/${articleId}`)
        .send(updateArticleRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    testDto<{ articleId: number }>([
      ['articleId', undefined],
      ['articleId', 'abc'],
    ])('[실패] PUT - 게시글 수정 게시글id가 %s인 경우', async (_, buildDto) => {
      const articleId = buildDto({
        articleId: articles[0].id,
      }).articleId;
      const updateArticleRequestDto: UpdateArticleRequestDto = {
        title: 'title2',
        content: 'content2',
        categoryId: categories.free.id,
      };

      const response = await request(httpServer)
        .put(`/articles/${articleId}`)
        .send(updateArticleRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    testDto<UpdateArticleRequestDto>([
      ['title', 123],
      ['title', 'a'.repeat(50), '42자를 넘김'],
      ['content', 123],
      ['content', 'a'.repeat(5000), '4242자를 넘김'],
      ['categoryId', 'abc'],
      ['categoryId', -1],
    ])('[실패] PUT - 게시글 수정 dto가 %s인 경우', async (_, buildDto) => {
      const articleId = articles[0].id;
      const updateArticleRequestDto = buildDto({
        title: 'title2',
        content: 'content2',
        categoryId: categories.free.id,
      });

      const response = await request(httpServer)
        .put(`/articles/${articleId}`)
        .send(updateArticleRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test('[성공] DELETE - 게시글 삭제', async () => {
      const articleId = articles[0].id;

      const response = await request(httpServer)
        .delete(`/articles/${articleId}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toEqual(HttpStatus.OK);

      const result = await articleRepository.findOne(articleId);
      expect(result).toBeFalsy();
    });

    test('[실패] DELETE - unauthorized', async () => {
      const articleId = articles[0].id;

      const response = await request(httpServer).delete(
        `/articles/${articleId}`,
      );

      expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    test('[실패] DELETE - 게시글 삭제 내가 쓴글이 아닌경우', async () => {
      const articleId = articles[1].id;

      const response = await request(httpServer)
        .delete(`/articles/${articleId}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toEqual(HttpStatus.NOT_FOUND);

      const result = await articleRepository.findOne(articleId);
      expect(result).toBeTruthy();
    });

    test('[실패] DELETE - 게시글 삭제 존재하지 않는 게시글', async () => {
      const articleId = 99;

      const response = await request(httpServer)
        .delete(`/articles/${articleId}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toEqual(HttpStatus.NOT_FOUND);

      const result = await articleRepository.findOne(articleId);
      expect(result).toBeFalsy();
    });

    testDto<{ articleId: number }>([
      ['articleId', undefined],
      ['articleId', 'abc'],
    ])('[실패] DELETE - 게시글 삭제 dto가 %s인 경우', async (_, buildDto) => {
      const articleId = buildDto({
        articleId: articles[0].id,
      }).articleId;

      const response = await request(httpServer)
        .delete(`/articles/${articleId}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });
});
