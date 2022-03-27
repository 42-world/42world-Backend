import { CategoryModule } from '@root/category/category.module';
import { AuthModule } from '@auth/auth.module';
import { CommentModule } from '@root/comment/comment.module';
import { ArticleModule } from '@root/article/article.module';
import { CategoryRepository } from '@category/repositories/category.repository';
import { ArticleRepository } from '@article/repositories/article.repository';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnection } from 'typeorm';

import { TestBaseModule } from '@test/e2e/test.base.module';
import { UserModule } from '@user/user.module';
import { InternalServerErrorExceptionFilter } from '@root/filters/internal-server-error-exception.filter';
import { TypeormExceptionFilter } from '@root/filters/typeorm-exception.filter';
import { clearDB } from '@test/e2e/utils/utils';
import * as dummy from './utils/dummy';
import { UserRole } from '@user/interfaces/userrole.interface';
import { UserRepository } from '@user/repositories/user.repository';
import { AuthService } from '@auth/auth.service';

describe('Comments', () => {
  let app: INestApplication;
  let userRepository: UserRepository;
  let authService: AuthService;
  let JWT;
  let articleRepository: ArticleRepository;
  let categoryRepository: CategoryRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TestBaseModule,
        UserModule,
        AuthModule,
        ArticleModule,
        CommentModule,
        CategoryModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());

    app.useGlobalFilters(new InternalServerErrorExceptionFilter());
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

  afterEach(async () => {
    await clearDB();
  });

  describe('/comments', () => {
    let newUser;
    beforeEach(async () => {
      newUser = dummy.user(
        'test1234',
        'first user',
        'githubUsername',
        UserRole.CADET,
      );
      await userRepository.save(newUser);
      JWT = dummy.jwt(newUser.id, newUser.role, authService);
    });

    test('[성공] POST', async () => {
      const categoryName = '자유게시판';
      const articleTitle = '제목';
      const articleContent = '본문';
      const commentContent = '재밌다';
      const category = dummy.category(categoryName);

      await categoryRepository.save(category);
      const targetArticle = dummy.article(
        category.id,
        newUser.id,
        articleTitle,
        articleContent,
      );
      await articleRepository.save(targetArticle);
      const response = await request(app)
        .post('/comments')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`)
        .send({ content: commentContent, articleId: targetArticle.id });
      console.log(response.body);
      const result = response.body;
      console.log('status == ', response.status);
      expect(response.status).toEqual(HttpStatus.CREATED);
      expect(result.content).toEqual(commentContent);
    });
  });
});
