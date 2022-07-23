import { ArticleModule } from '@api/article/article.module';
import { ArticleRepository } from '@api/article/repositories/article.repository';
import { AuthModule } from '@api/auth/auth.module';
import { AuthService } from '@api/auth/auth.service';
import { CategoryModule } from '@api/category/category.module';
import { CategoryRepository } from '@api/category/repositories/category.repository';
import { CommentModule } from '@api/comment/comment.module';
import { UserRepository } from '@api/user/repositories/user.repository';
import { UserModule } from '@api/user/user.module';
import { Article } from '@app/entity/article/article.entity';
import { Comment } from '@app/entity/comment/comment.entity';
import { User } from '@app/entity/user/user.entity';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { E2eTestBaseModule } from '@test/e2e/e2e-test.base.module';
import { clearDB, createTestApp } from '@test/e2e/utils/utils';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { CommentRepository } from './../../src/comment/repositories/comment.repository';
import * as dummy from './utils/dummy';

describe('Comments', () => {
  let httpServer: INestApplication;
  let userRepository: UserRepository;
  let authService: AuthService;
  let articleRepository: ArticleRepository;
  let categoryRepository: CategoryRepository;
  let commentRepository: CommentRepository;

  let JWT: string;
  let anotherJWT: string;
  let adminJWT: string;
  let noviceJWT: string;

  const commentContent = '댓글 내용';
  let users: dummy.DummyUsers;
  let categories: dummy.DummyCategories;
  let articles: dummy.DummyArticles;
  let comments: dummy.DummyComments;
  let cadetUser: User;
  let anotherCadetUser: User;
  let adminUser: User;
  let noviceUser: User;
  let targetArticle: Article;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [E2eTestBaseModule, UserModule, AuthModule, ArticleModule, CommentModule, CategoryModule],
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

  afterEach(async () => {
    await clearDB();
  });

  beforeEach(async () => {
    users = await dummy.createDummyUsers(userRepository);
    cadetUser = users.cadet[0];
    JWT = dummy.jwt(cadetUser, authService);

    anotherCadetUser = users.cadet[1];
    anotherJWT = dummy.jwt(anotherCadetUser, authService);

    adminUser = users.admin[0];
    adminJWT = dummy.jwt(adminUser, authService);

    noviceUser = users.novice[0];
    noviceJWT = dummy.jwt(noviceUser, authService);

    categories = await dummy.createDummyCategories(categoryRepository);

    articles = await dummy.createDummyArticles(articleRepository, users, categories);
    targetArticle = articles.first;
  });

  describe('/comments', () => {
    test('[성공] POST - 댓글 생성', async () => {
      const response = await request(httpServer)
        .post('/comments')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`)
        .send({ content: commentContent, articleId: targetArticle.id });

      expect(response.status).toEqual(HttpStatus.CREATED);

      const result = response.body;

      expect(result.content).toEqual(commentContent);
      expect(result.writerId).toEqual(cadetUser.id);
      expect(result.writer.role).toEqual(cadetUser.role);
    });

    test('[성공] POST - 권한 높은 유저가 댓글 생성', async () => {
      const response = await request(httpServer)
        .post('/comments')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${adminJWT}`)
        .send({ content: commentContent, articleId: targetArticle.id });

      expect(response.status).toEqual(HttpStatus.CREATED);
    });

    test('[실패] POST - 권한 낮은 유저가 댓글 생성', async () => {
      const response = await request(httpServer)
        .post('/comments')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${noviceJWT}`)
        .send({ content: commentContent, articleId: targetArticle.id });

      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });
  });

  describe('/comments/:id', () => {
    let comment: Comment;

    beforeEach(async () => {
      comments = await dummy.createDummyComments(commentRepository, users, articles);
      comment = comments.first;
    });

    test('[성공] PUT - 댓글 수정', async () => {
      const updateContent = '수정된 댓글 내용';

      const response = await request(httpServer)
        .put(`/comments/${comment.id}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`)
        .send({ content: updateContent });

      expect(response.status).toEqual(HttpStatus.OK);
    });

    test('[실패] PUT - 작성자가 아닌 다른 카뎃이 댓글 수정', async () => {
      const response = await request(httpServer)
        .delete(`/comments/${comment.id}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${anotherJWT}`);

      expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    });

    test('[성공] DELETE - 댓글 삭제', async () => {
      const response = await request(httpServer)
        .delete(`/comments/${comment.id}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(HttpStatus.OK);
    });

    test('[성공] DELETE - 작성자가 아닌 다른 카뎃이 댓글 삭제', async () => {
      const response = await request(httpServer)
        .delete(`/comments/${comment.id}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${anotherJWT}`);

      expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    });

    test('[실패] DELETE & PUT - 삭제된 댓글 수정', async () => {
      await request(httpServer)
        .delete(`/comments/${comment.id}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      const updateContent = '수정된 댓글 내용';

      const response = await request(httpServer)
        .put(`/comments/${comment.id}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`)
        .send({ content: updateContent });

      expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    });

    test.skip('[실패] DELETE & DELETE - 삭제된 것을 또 삭제', async () => {
      await request(httpServer)
        .delete(`/comments/${comment.id}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      const response = await request(httpServer)
        .delete(`/comments/${comment.id}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    });
  });
});
