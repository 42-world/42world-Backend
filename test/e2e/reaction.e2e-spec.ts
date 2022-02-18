import { ArticleModule } from '@article/article.module';
import { ArticleRepository } from '@article/repositories/article.repository';
import { AuthModule } from '@auth/auth.module';
import { AuthService } from '@auth/auth.service';
import { CategoryModule } from '@category/category.module';
import { CategoryRepository } from '@category/repositories/category.repository';
import { CommentModule } from '@comment/comment.module';
import { CommentRepository } from '@comment/repositories/comment.repository';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeormExceptionFilter } from '@root/filters/typeorm-exception.filter';
import { ReactionModule } from '@root/reaction/reaction.module';
import { ReactionArticleRepository } from '@root/reaction/repositories/reaction-article.repository';
import { UserRole } from '@user/entities/user.entity';
import { UserRepository } from '@user/repositories/user.repository';
import { UserModule } from '@user/user.module';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { TestBaseModule } from './test.base.module';
import * as dummy from './utils/dummy';

describe('Reaction', () => {
  let app: INestApplication;
  let userRepository: UserRepository;
  let articleRepository: ArticleRepository;
  let categoryRepository: CategoryRepository;
  let commentRepository: CommentRepository;
  let reactionArticleRepository: ReactionArticleRepository;
  let authService: AuthService;
  let JWT;

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
    commentRepository = moduleFixture.get<CommentRepository>(CommentRepository);
    reactionArticleRepository = moduleFixture.get<ReactionArticleRepository>(
      ReactionArticleRepository,
    );

    authService = moduleFixture.get<AuthService>(AuthService);

    app = app.getHttpServer();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    await getConnection().close();
    await app.close();
  });

  describe('/reactions/articles/{id}', async () => {
    beforeAll(async () => {
      const user = dummy.user('token', 'nickname', UserRole.CADET);
      await userRepository.save(user);
      JWT = dummy.jwt(user.id, user.role, authService);
      const category = dummy.category('category');
      await categoryRepository.save(category);
      const article = dummy.article(category.id, user.id, 'title', 'content');
      await articleRepository.save(article);
    });

    afterAll(async () => {
      await Promise.all([
        userRepository.clear(),
        articleRepository.clear(),
        commentRepository.clear(),
        categoryRepository.clear(),
        reactionArticleRepository.clear(),
      ]);
    });

    test('[성공] POST - 좋아요가 없는 경우', async () => {
      const response = await request(app)
        .post('/reactions/articles/1')
        .set('Cookie', `access_token=${JWT}`);

      expect(response.status).toEqual(201);
      expect(response.body.isLike).toEqual(true);
      expect(response.body.likeCount).toEqual(1);
    });

    test('[성공] POST - 좋아요가 있는 경우', async () => {
      await request(app)
        .post('/reactions/articles/1')
        .set('Cookie', `access_token=${JWT}`);

      const response2 = await request(app)
        .post('/reactions/articles/1')
        .set('Cookie', `access_token=${JWT}`);

      expect(response2.status).toEqual(201);
      expect(response2.body.isLike).toEqual(false);
      expect(response2.body.likeCount).toEqual(0);
    });

    test('[실패] POST - unauthorize', async () => {
      const response = await request(app).post('/reactions/articles/1');

      expect(response.status).toEqual(401);
    });

    test('[실패] POST - 없는 id를 보내는 경우', async () => {
      const response = await request(app)
        .post('/reactions/articles/0')
        .set('Cookie', `access_token=${JWT}`);

      expect(response.status).toEqual(404);
    });
  });
});
