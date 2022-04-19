import { ArticleModule } from '@api/article/article.module';
import { CreateArticleRequestDto } from '@api/article/dto/request/create-article-request.dto';
import { FindAllArticleRequestDto } from '@api/article/dto/request/find-all-article-request.dto';
import { UpdateArticleRequestDto } from '@api/article/dto/request/update-article-request.dto';
import { CreateArticleResponseDto } from '@api/article/dto/response/create-article-response.dto';
import { FindOneArticleResponseDto } from '@api/article/dto/response/find-one-article-response.dto';
import { ArticleRepository } from '@api/article/repositories/article.repository';
import { AuthModule } from '@api/auth/auth.module';
import { AuthService } from '@api/auth/auth.service';
import { CategoryModule } from '@api/category/category.module';
import { CategoryRepository } from '@api/category/repositories/category.repository';
import { CommentModule } from '@api/comment/comment.module';
import { CommentRepository } from '@api/comment/repositories/comment.repository';
import { UserRepository } from '@api/user/repositories/user.repository';
import {
  ANONY_USER_CHARACTER,
  ANONY_USER_ID,
  ANONY_USER_NICKNAME,
} from '@api/user/user.constant';
import { UserModule } from '@api/user/user.module';
import { Article } from '@app/entity/article/article.entity';
import { Comment } from '@app/entity/comment/comment.entity';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { TestBaseModule } from './test.base.module';
import * as dummy from './utils/dummy';
import { clearDB, createTestApp } from './utils/utils';
import { testDto } from './utils/validate-test';

describe('Article', () => {
  let httpServer: INestApplication;

  let userRepository: UserRepository;
  let articleRepository: ArticleRepository;
  let categoryRepository: CategoryRepository;
  let commentRepository: CommentRepository;

  let authService: AuthService;
  let JWT: string;

  let users: dummy.DummyUsers;
  let categories: dummy.DummyCategories;
  let articles: dummy.DummmyArticles;

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

  describe('/articles', () => {
    beforeEach(async () => {
      users = await dummy.createDummyUsers(userRepository);
      categories = await dummy.createDummyCategories(categoryRepository);
      articles = await dummy.createDummyArticles(
        articleRepository,
        users,
        categories,
      );
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
      expect(responseArticles.length).toBe(4);
      expect(responseArticles[0].id).toBe(articles.normal[0].id);
      expect(responseArticles[0].title).toBe(articles.normal[0].title);
      expect(responseArticles[0].content).toBe(articles.normal[0].content);
      expect(responseArticles[0].writerId).toBe(articles.normal[0].writerId);
      expect(responseArticles[0].writer.id).toBe(articles.normal[0].writerId);
      expect(responseArticles[0].writer.nickname).toBe(users.cadet[0].nickname);
      expect(responseArticles[0].viewCount).toBe(articles.normal[0].viewCount);
      expect(responseArticles[0].likeCount).toBe(articles.normal[0].likeCount);
      expect(responseArticles[0].commentCount).toBe(
        articles.normal[0].commentCount,
      );
      expect(responseArticles[0].categoryId).toBe(
        findArticleRequestDto.categoryId,
      );
      expect(responseArticles[1].id).toBe(articles.normal[1].id);
      expect(responseArticles[1].categoryId).toBe(
        findArticleRequestDto.categoryId,
      );
    });

    test('[실패] GET - unauthorized', async () => {
      const response = await request(httpServer).get('/articles');

      expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    test('[성공] GET - 익명 게시글 목록 조회', async () => {
      const findArticleRequestDto = {
        categoryId: categories.anony.id,
      };

      const response = await request(httpServer)
        .get('/articles')
        .query(findArticleRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toEqual(HttpStatus.OK);

      const responseArticles = response.body.data as Article[];
      expect(responseArticles[0].id).toBe(articles.anony.id);
      expect(responseArticles[0].title).toBe(articles.anony.title);
      expect(responseArticles[0].content).toBe(articles.anony.content);
      expect(responseArticles[0].writerId).toBe(ANONY_USER_ID);
      expect(responseArticles[0].writer.id).toBe(ANONY_USER_ID);
      expect(responseArticles[0].writer.role).toBeUndefined();
      expect(responseArticles[0].writer.createdAt).toBeUndefined();
      expect(responseArticles[0].writer.updatedAt).toBeUndefined();
      expect(responseArticles[0].writer.nickname).toBe(ANONY_USER_NICKNAME);
      expect(responseArticles[0].writer.character).toBe(ANONY_USER_CHARACTER);
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

  describe('/articles/{id}/comments', () => {
    let comments: Comment[];

    beforeEach(async () => {
      users = await dummy.createDummyUsers(userRepository);
      categories = await dummy.createDummyCategories(categoryRepository);
      articles = await dummy.createDummyArticles(
        articleRepository,
        users,
        categories,
      );
      comments = await commentRepository.save([
        dummy.comment(users.cadet[0].id, articles.normal[0].id, 'comment1'),
        dummy.comment(users.cadet[0].id, articles.normal[0].id, 'comment2'),
        dummy.comment(users.cadet[0].id, articles.normal[1].id, 'comment3'),
        dummy.comment(users.cadet[0].id, articles.normal[1].id, 'comment4'),
      ]);
      JWT = dummy.jwt2(users.cadet[0], authService);
    });

    test('[성공] GET - 게시글 댓글 목록 조회', async () => {
      const articleId = articles.normal[0].id;

      const response = await request(httpServer)
        .get(`/articles/${articleId}/comments`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toBe(HttpStatus.OK);

      const responseComments = response.body.data as Comment[];
      expect(responseComments.length).toBe(2);
      expect(responseComments[0].id).toBe(comments[1].id);
      expect(responseComments[0].content).toBe(comments[1].content);
      expect(responseComments[0].writerId).toBe(comments[1].writerId);
      expect(responseComments[0].writer.id).toBe(comments[1].writerId);
      expect(responseComments[0].writer.nickname).toBe(users.cadet[0].nickname);
      expect(responseComments[0].articleId).toBe(comments[1].articleId);
      expect(responseComments[0].likeCount).toBe(comments[1].likeCount);
      expect(responseComments[1].id).toBe(comments[0].id);
    });

    // TODO: 여기 테스트 기능 구현할것
    test.skip('[성공] GET - 익명 게시글 댓글 목록 조희', async () => {
      const articleId = articles.normal[1].id;

      const response = await request(httpServer)
        .get(`/articles/${articleId}/comments`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toBe(HttpStatus.OK);

      const responseComments = response.body.data as Comment[];
      expect(responseComments.length).toBe(2);
      expect(responseComments[0].id).toBe(comments[1].id);
      expect(responseComments[0].content).toBe(comments[1].content);
      expect(responseComments[0].writerId).toBe(ANONY_USER_ID);
      expect(responseComments[0].writer.id).toBe(ANONY_USER_ID);
      expect(responseComments[0].writer.nickname).toBe(ANONY_USER_NICKNAME);
      expect(responseComments[0].writer.character).toBe(ANONY_USER_CHARACTER);
      expect(responseComments[0].articleId).toBe(comments[1].articleId);
      expect(responseComments[0].likeCount).toBe(comments[1].likeCount);
      expect(responseComments[1].id).toBe(comments[0].id);
    });

    test('[실패] GET - unauthorized', async () => {
      const articleId = articles.normal[0].id;

      const response = await request(httpServer).get(
        `/articles/${articleId}/comments`,
      );

      expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    test('[성공] GET - 게시글 댓글 목록 조회 권한 높은사람', async () => {
      const articleId = articles.normal[0].id;

      JWT = dummy.jwt2(users.admin[0], authService);
      const response = await request(httpServer)
        .get(`/articles/${articleId}/comments`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toBe(HttpStatus.OK);
    });

    test('[실패] GET - 게시글 댓글 목록 조회 권한 낮은사람', async () => {
      const articleId = articles.normal[0].id;

      JWT = dummy.jwt2(users.novice[0], authService);
      const response = await request(httpServer)
        .get(`/articles/${articleId}/comments`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toBe(HttpStatus.NOT_ACCEPTABLE);
    });

    test('[실패] GET - 게시글 댓글 목록 존재하지 않는 게시글', async () => {
      const articleId = 99;

      const response = await request(httpServer)
        .get(`/articles/${articleId}/comments`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    testDto<{ articleId: number }>([
      ['articleId', undefined],
      ['articleId', 'abc'],
    ])('[실패] GET - 게시글 댓글 목록 %s인 경우', async (_, buildDto) => {
      const articleId = buildDto({
        articleId: articles.normal[0].id,
      }).articleId;

      const response = await request(httpServer)
        .get(`/articles/${articleId}/comments`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/articles/{id}', () => {
    beforeEach(async () => {
      users = await dummy.createDummyUsers(userRepository);
      categories = await dummy.createDummyCategories(categoryRepository);
      articles = await dummy.createDummyArticles(
        articleRepository,
        users,
        categories,
      );
      JWT = dummy.jwt2(users.cadet[0], authService);
    });

    test('[성공] GET - 게시글 상세 조회', async () => {
      const articleId = articles.normal[0].id;

      const response = await request(httpServer)
        .get(`/articles/${articleId}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toEqual(HttpStatus.OK);

      const result = response.body as FindOneArticleResponseDto;
      expect(result.title).toBe(articles.normal[0].title);
      expect(result.content).toBe(articles.normal[0].content);
      expect(result.categoryId).toBe(articles.normal[0].categoryId);
      expect(result.writerId).toBe(articles.normal[0].writerId);
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
      const articleId = articles.normal[0].id;

      const response = await request(httpServer).get(`/articles/${articleId}`);

      expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    test('[성공] GET - 익명 게시글 상세 조회', async () => {
      const articleId = articles.anony.id;

      const response = await request(httpServer)
        .get(`/articles/${articleId}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toEqual(HttpStatus.OK);

      const result = response.body;
      expect(result.title).toBe(articles.anony.title);
      expect(result.content).toBe(articles.anony.content);
      expect(result.categoryId).toBe(articles.anony.categoryId);
      expect(result.writerId).toBe(ANONY_USER_ID);
      expect(result.category.id).toBe(categories.anony.id);
      expect(result.writer.id).toBe(ANONY_USER_ID);
      expect(result.writer.role).toBeUndefined();
      expect(result.writer.createdAt).toBeUndefined();
      expect(result.writer.updatedAt).toBeUndefined();
      expect(result.writer.nickname).toContain(ANONY_USER_NICKNAME);
      expect(result.writer.character).toBe(ANONY_USER_CHARACTER);
    });

    test('[성공] GET - 게시글 상세 조회 권한 높은사람', async () => {
      const articleId = articles.normal[0].id;

      JWT = dummy.jwt2(users.admin[0], authService);
      const response = await request(httpServer)
        .get(`/articles/${articleId}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toEqual(HttpStatus.OK);
    });

    test('[실패] GET - 게시글 상세 조회 권한 낮은사람', async () => {
      const articleId = articles.normal[0].id;

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
        articleId: articles.normal[0].id,
      }).articleId;

      const response = await request(httpServer)
        .get(`/articles/${articleId}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    // TODO: novice 도 게시글 수정/삭제 가능한지 추가
    test('[성공] PUT - 게시글 수정', async () => {
      const articleId = articles.normal[0].id;
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
      const articleId = articles.normal[0].id;

      const response = await request(httpServer).put(`/articles/${articleId}`);

      expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    test('[실패] PUT - 게시글 수정 내가 쓴글이 아닌경우', async () => {
      const articleId = articles.normal[1].id;
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
      expect(result.title).toBe(articles.normal[1].title);
      expect(result.content).toBe(articles.normal[1].content);
      expect(result.categoryId).toBe(articles.normal[1].categoryId);
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
      const articleId = articles.normal[0].id;
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
        articleId: articles.normal[0].id,
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
      const articleId = articles.normal[0].id;
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
      const articleId = articles.normal[0].id;

      const response = await request(httpServer)
        .delete(`/articles/${articleId}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(response.status).toEqual(HttpStatus.OK);

      const result = await articleRepository.findOne(articleId);
      expect(result).toBeFalsy();
    });

    test('[실패] DELETE - unauthorized', async () => {
      const articleId = articles.normal[0].id;

      const response = await request(httpServer).delete(
        `/articles/${articleId}`,
      );

      expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    test('[실패] DELETE - 게시글 삭제 내가 쓴글이 아닌경우', async () => {
      const articleId = articles.normal[1].id;

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
        articleId: articles.normal[0].id,
      }).articleId;

      const response = await request(httpServer)
        .delete(`/articles/${articleId}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });
});
