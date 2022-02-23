import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import * as cookieParser from 'cookie-parser';

import { AuthModule } from '@auth/auth.module';
import { UserModule } from '@user/user.module';
import { UserRepository } from '@user/repositories/user.repository';
import { User } from '@user/entities/user.entity';
import { AuthService } from '@auth/auth.service';
import { TestBaseModule } from './test.base.module';
import { TypeormExceptionFilter } from '@root/filters/typeorm-exception.filter';
import { ArticleModule } from '@article/article.module';
import { ArticleRepository } from '@article/repositories/article.repository';
import { Article } from '@article/entities/article.entity';
import { CategoryModule } from '@category/category.module';
import { Category } from '@category/entities/category.entity';
import { CategoryRepository } from '@category/repositories/category.repository';
import { CommentModule } from '@comment/comment.module';
import { ReactionModule } from '@root/reaction/reaction.module';
import { UserRole } from '@root/user/interfaces/userrole.interface';
import { CreateArticleRequestDto } from '@root/article/dto/request/create-article-request.dto';
import * as dummy from './utils/dummy';
import { clearDB } from './utils/utils';
import {
  buildValidateTest,
  값이_없는_경우,
  엔티티가_없는_경우,
  잘못된_값을_입력한_경우,
  타입이_틀린_경우,
} from './utils/validate-test';
import { FindArticleRequestDto } from '@root/article/dto/request/find-article-request.dto';
import { PageDto } from '@root/pagination/pagination.dto';
import { DetailArticleDto } from '@root/article/dto/detail-article.dto';
import { UpdateArticleRequestDto } from '@root/article/dto/request/update-article-request.dto';

describe('Create Article (e2e)', () => {
  let app: INestApplication;

  let userRepository: UserRepository;
  let articleRepository: ArticleRepository;
  let categoryRepository: CategoryRepository;

  let authService: AuthService;
  let JWT: string;

  let dummyUsers: User[];
  let dummyCategories: Category[];
  let dummyArticles: Article[];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TestBaseModule,
        UserModule,
        AuthModule,
        ArticleModule,
        CategoryModule,
        CommentModule,
        ReactionModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());

    app.useGlobalFilters(new TypeormExceptionFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    userRepository = moduleFixture.get<UserRepository>(UserRepository);
    articleRepository = moduleFixture.get<ArticleRepository>(ArticleRepository);
    categoryRepository =
      moduleFixture.get<CategoryRepository>(CategoryRepository);

    authService = moduleFixture.get<AuthService>(AuthService);

    app = app.getHttpServer();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    await getConnection().close();
    await app.close();
  });

  beforeEach(async () => {
    dummyUsers = [];
    dummyCategories = [];
    dummyArticles = [];

    await clearDB();
  });

  describe('/articles', () => {
    beforeEach(async () => {
      dummyUsers = await userRepository.save([
        dummy.user('test1234', 'first_user', UserRole.CADET),
        dummy.user('test2345', 'second_user', UserRole.CADET),
      ]);
      dummyCategories = await categoryRepository.save([
        dummy.category('first_category'),
        dummy.category('second_category'),
      ]);
      dummyArticles = await articleRepository.save([
        dummy.article(
          dummyCategories[0].id,
          dummyUsers[0].id,
          'title1',
          'content1',
        ),
        dummy.article(
          dummyCategories[0].id,
          dummyUsers[0].id,
          'title2',
          'content2',
        ),
        dummy.article(
          dummyCategories[1].id,
          dummyUsers[0].id,
          'title3',
          'content3',
        ),
      ]);
      JWT = dummy.jwt(dummyUsers[0].id, dummyUsers[0].role, authService);
    });

    test('[성공] POST - 게시글 정상 업로드', async () => {
      const createArticlRequesteDto: CreateArticleRequestDto = {
        title: 'test title',
        content: 'test content',
        categoryId: dummyCategories[0].id,
      };

      const response = await request(app)
        .post('/articles')
        .send(createArticlRequesteDto)
        .set('Cookie', `access_token=${JWT}`);
      expect(response.status).toEqual(201);

      const result = response.body as Article;
      expect(result.title).toBe(createArticlRequesteDto.title);
      expect(result.content).toBe(createArticlRequesteDto.content);
      expect(result.categoryId).toBe(createArticlRequesteDto.categoryId);
      expect(result.writerId).toBe(dummyUsers[0].id);
      expect(result.viewCount).toBe(0);
      expect(result.likeCount).toBe(0);
      expect(result.commentCount).toBe(0);
    });

    test.each([
      ...buildValidateTest<CreateArticleRequestDto>('title', [
        값이_없는_경우(),
        타입이_틀린_경우({
          wrongValue: 123,
          message: ['title must be a string'],
        }),
        잘못된_값을_입력한_경우({
          detail: '42자를 넘김',
          wrongValue: 'a'.repeat(50),
          message: ['title must be shorter than or equal to 42 characters'],
        }),
      ]),
      ...buildValidateTest<CreateArticleRequestDto>('content', [
        값이_없는_경우(),
        타입이_틀린_경우({
          wrongValue: 123,
          message: ['content must be a string'],
        }),
        잘못된_값을_입력한_경우({
          detail: '4242자를 넘김',
          wrongValue: 'a'.repeat(5000),
          message: ['content must be shorter than or equal to 4242 characters'],
        }),
      ]),
      ...buildValidateTest<CreateArticleRequestDto>('categoryId', [
        값이_없는_경우(),
        타입이_틀린_경우({
          wrongValue: 'abc',
          message: ['categoryId must be an integer number'],
        }),
        잘못된_값을_입력한_경우({
          detail: '음수',
          wrongValue: -1,
          message: ['categoryId must not be less than 0'],
        }),
        엔티티가_없는_경우({
          notExistEntityId: 99,
        }),
      ]),
    ])('[실패] POST - %s', async (_, tester) => {
      const createArticlRequesteDto = tester.buildDto({
        title: 'test title',
        content: 'test content',
        categoryId: dummyCategories[0].id,
      });

      const response = await request(app)
        .post('/articles')
        .send(createArticlRequesteDto)
        .set('Cookie', `access_token=${JWT}`);

      tester.expectErrorResponse(response);
    });

    test('[성공] GET - 게시글 목록 조회', async () => {
      const findArticleRequestDto = {
        categoryId: dummyCategories[0].id,
      };

      const response = await request(app)
        .get('/articles')
        .query(findArticleRequestDto)
        .set('Cookie', `access_token=${JWT}`);
      expect(response.status).toEqual(200);

      const answerArticles: Article[] = dummyArticles.filter((article) => {
        return article.categoryId === dummyCategories[0].id;
      });
      const articles: PageDto<Article> = response.body as PageDto<Article>;
      articles.data.forEach((article: Article) => {
        //TODO: response field 다 들어있는지 확인
        expect(answerArticles.map((e) => e.id)).toContainEqual(article.id);
      });
    });

    test.each([
      ...buildValidateTest<FindArticleRequestDto>('categoryId', [
        타입이_틀린_경우({
          wrongValue: 'abc',
          message: ['categoryId must be an integer number'],
        }),
        잘못된_값을_입력한_경우({
          detail: '음수',
          wrongValue: -1,
          message: ['categoryId must not be less than 0'],
        }),
      ]),
    ])('[실패] GET - %s', async (_, tester) => {
      const findArticleRequestDto = tester.buildDto({
        categoryId: dummyCategories[0].id,
        page: 1,
        take: 10,
        skip: 0,
      });

      const response = await request(app)
        .get('/articles')
        .query(findArticleRequestDto)
        .set('Cookie', `access_token=${JWT}`);

      tester.expectErrorResponse(response);
    });
  });

  describe('/articles/:id', () => {
    type ArticleIdQuery = { articleId: number };
    const articleIdValidateTests = [
      타입이_틀린_경우({
        wrongValue: 'abc',
        message: 'Validation failed (numeric string is expected)',
      }),
      엔티티가_없는_경우({
        // TODO: 테스트 타입을 잘못된 값을 입력한 경우로 변경
        notExistEntityId: -1,
      }),
      엔티티가_없는_경우({
        notExistEntityId: 99,
      }),
    ];

    beforeEach(async () => {
      dummyUsers = await userRepository.save([
        dummy.user('test1234', 'first_user', UserRole.CADET),
        dummy.user('test1234', 'second_user', UserRole.CADET),
      ]);
      dummyCategories = await categoryRepository.save([
        dummy.category('first_category'),
      ]);
      dummyArticles = await articleRepository.save([
        dummy.article(
          dummyCategories[0].id,
          dummyUsers[0].id,
          'title1',
          'content1',
        ),
        dummy.article(
          dummyCategories[0].id,
          dummyUsers[1].id,
          'title2',
          'content2',
        ),
      ]);
      JWT = dummy.jwt(dummyUsers[0].id, dummyUsers[0].role, authService);
    });

    test('[성공] GET - 게시글 상세 조회', async () => {
      const articleId = dummyArticles[0].id;

      const response = await request(app)
        .get(`/articles/${articleId}`)
        .set('Cookie', `access_token=${JWT}`);
      expect(response.status).toEqual(200);

      const result = response.body as DetailArticleDto;
      expect(result.title).toBe(dummyArticles[0].title);
      expect(result.content).toBe(dummyArticles[0].content);
      expect(result.categoryId).toBe(dummyArticles[0].categoryId);
      expect(result.writerId).toBe(dummyUsers[0].id);
      expect(result.viewCount).toBe(0);
      expect(result.likeCount).toBe(0);
      expect(result.commentCount).toBe(0);
      expect(result.isLike).toBe(false);
      expect(result.category.id).toBe(dummyCategories[0].id);
      expect(result.writer.id).toBe(dummyUsers[0].id);
    });

    test.each([
      ...buildValidateTest<ArticleIdQuery>('articleId', articleIdValidateTests),
    ])('[실패] GET - %s', async (_, tester) => {
      const articleId = tester.buildDto({
        articleId: dummyArticles[0].id,
      }).articleId;

      const response = await request(app)
        .get(`/articles/${articleId}`)
        .set('Cookie', `access_token=${JWT}`);

      tester.expectErrorResponse(response);
    });

    test('[성공] PUT - 게시글 수정', async () => {
      const articleId = dummyArticles[0].id;
      const updateArticleRequestDto: UpdateArticleRequestDto = {
        title: 'title2',
        content: 'content2',
        categoryId: dummyCategories[0].id,
      };

      const response = await request(app)
        .put(`/articles/${articleId}`)
        .send(updateArticleRequestDto)
        .set('Cookie', `access_token=${JWT}`);
      expect(response.status).toEqual(200);

      const result = await articleRepository.findOne(articleId);
      expect(result.title).toBe(updateArticleRequestDto.title);
      expect(result.content).toBe(updateArticleRequestDto.content);
      expect(result.categoryId).toBe(updateArticleRequestDto.categoryId);
      expect(result.writerId).toBe(dummyUsers[0].id);
    });

    test('[실패] PUT - 내가 쓴글이 아닌 게시글 수정', async () => {
      const articleId = dummyArticles[1].id;
      const updateArticleRequestDto: UpdateArticleRequestDto = {
        title: 'title2',
        content: 'content2',
        categoryId: dummyCategories[0].id,
      };

      const response = await request(app)
        .put(`/articles/${articleId}`)
        .send(updateArticleRequestDto)
        .set('Cookie', `access_token=${JWT}`);
      expect(response.status).toEqual(404);

      const result = await articleRepository.findOne(articleId);
      expect(result.title).toBe(dummyArticles[1].title);
      expect(result.content).toBe(dummyArticles[1].content);
      expect(result.categoryId).toBe(dummyArticles[1].categoryId);
    });

    test.each([
      ...buildValidateTest<ArticleIdQuery>('articleId', articleIdValidateTests),
      ...buildValidateTest<UpdateArticleRequestDto>('title', [
        타입이_틀린_경우({
          wrongValue: 123,
          message: ['title must be a string'],
        }),
        잘못된_값을_입력한_경우({
          detail: '42자를 넘김',
          wrongValue: 'a'.repeat(50),
          message: ['title must be shorter than or equal to 42 characters'],
        }),
      ]),
      ...buildValidateTest<UpdateArticleRequestDto>('content', [
        타입이_틀린_경우({
          wrongValue: 123,
          message: ['content must be a string'],
        }),
        잘못된_값을_입력한_경우({
          detail: '4242자를 넘김',
          wrongValue: 'a'.repeat(5000),
          message: ['content must be shorter than or equal to 4242 characters'],
        }),
      ]),
      ...buildValidateTest<CreateArticleRequestDto>('categoryId', [
        타입이_틀린_경우({
          wrongValue: 'abc',
          message: ['categoryId must be an integer number'],
        }),
        잘못된_값을_입력한_경우({
          detail: '음수',
          wrongValue: -1,
          message: ['categoryId must not be less than 0'],
        }),
        엔티티가_없는_경우({
          notExistEntityId: 99,
        }),
      ]),
    ])('[실패] PUT - %s', async (_, tester) => {
      const dto = tester.buildDto({
        articleId: dummyArticles[0].id,
        title: 'title2',
        content: 'content2',
        categoryId: dummyCategories[0].id,
      });
      const { articleId, ...updateArticleRequestDto } = dto as ArticleIdQuery &
        UpdateArticleRequestDto;

      const response = await request(app)
        .put(`/articles/${articleId}`)
        .send(updateArticleRequestDto)
        .set('Cookie', `access_token=${JWT}`);

      tester.expectErrorResponse(response);
    });

    test('[성공] DELETE - 게시글 삭제', async () => {
      const articleId = dummyArticles[0].id;

      const response = await request(app)
        .delete(`/articles/${articleId}`)
        .set('Cookie', `access_token=${JWT}`);
      expect(response.status).toEqual(200);

      const result = await articleRepository.findOne(articleId);
      expect(result).toBeFalsy();
    });

    test('[실패] DELETE - 내가 쓴글이 아닌 게시글 삭제', async () => {
      const articleId = dummyArticles[1].id;

      const response = await request(app)
        .delete(`/articles/${articleId}`)
        .set('Cookie', `access_token=${JWT}`);
      expect(response.status).toEqual(404);

      const result = await articleRepository.findOne(articleId);
      expect(result).toBeTruthy();
    });

    test.each([
      ...buildValidateTest<ArticleIdQuery>('articleId', articleIdValidateTests),
    ])('[실패] DELETE - %s', async (_, tester) => {
      const articleId = tester.buildDto({
        articleId: dummyArticles[0].id,
      }).articleId;

      const response = await request(app)
        .delete(`/articles/${articleId}`)
        .set('Cookie', `access_token=${JWT}`);

      tester.expectErrorResponse(response);
    });
  });
});
