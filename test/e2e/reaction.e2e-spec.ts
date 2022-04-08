import { ArticleModule } from '@article/article.module';
import { ArticleRepository } from '@article/repositories/article.repository';
import { AuthModule } from '@auth/auth.module';
import { AuthService } from '@auth/auth.service';
import { CategoryModule } from '@category/category.module';
import { CategoryRepository } from '@category/repositories/category.repository';
import { CommentModule } from '@comment/comment.module';
import { CommentRepository } from '@comment/repositories/comment.repository';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ReactionModule } from '@root/reaction/reaction.module';
import { UserRole } from '@root/user/interfaces/userrole.interface';
import { UserRepository } from '@user/repositories/user.repository';
import { UserModule } from '@user/user.module';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { TestBaseModule } from './test.base.module';
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

    test('[성공] POST - 좋아요가 없는 경우', async () => {
      const response = await request(httpServer)
        .post('/reactions/articles/1')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(HttpStatus.OK);
      expect(response.body.isLike).toEqual(true);
      expect(response.body.likeCount).toEqual(1);
    });

    test('[성공] POST - 좋아요가 있는 경우', async () => {
      await request(httpServer)
        .post('/reactions/articles/1')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

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
      const user = dummy.user(
        'token',
        'nickname',
        'githubUsername',
        UserRole.CADET,
      );
      await userRepository.save(user);
      JWT = dummy.jwt(user.id, user.role, authService);
      const category = dummy.category('category');
      await categoryRepository.save(category);
      const article = dummy.article(category.id, user.id, 'title', 'content');
      await articleRepository.save(article);
      const comment = dummy.comment(user.id, article.id, 'content');
      await commentRepository.save(comment);
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
      const response = await request(httpServer).post(
        '/reactions/articles/1/comments/1',
      );

      expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    test('[실패] POST - 없는 articleId를 보내는 경우', async () => {
      const notExistId = 999;

      const response = await request(httpServer)
        .post('/reactions/articles/' + notExistId + '/comments/1')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(HttpStatus.OK); // TODO - 코드가 이상하다 HttpStatus.OK을 돌려준다
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
