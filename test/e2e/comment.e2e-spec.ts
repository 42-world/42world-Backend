import { CommentRepository } from './../../src/comment/repositories/comment.repository';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnection } from 'typeorm';

import { CategoryModule } from '@category/category.module';
import { AuthModule } from '@auth/auth.module';
import { ArticleModule } from '@article/article.module';
import { ArticleRepository } from '@article/repositories/article.repository';
import { CategoryRepository } from '@category/repositories/category.repository';
import { CommentModule } from '@comment/comment.module';
import { TestBaseModule } from '@test/e2e/test.base.module';
import { UserModule } from '@user/user.module';
import { clearDB, createTestApp } from '@test/e2e/utils/utils';
import { UserRole } from '@user/interfaces/userrole.interface';
import { UserRepository } from '@user/repositories/user.repository';
import { AuthService } from '@auth/auth.service';
import * as dummy from './utils/dummy';

describe('Comments', () => {
  let httpServer: INestApplication;
  let userRepository: UserRepository;
  let authService: AuthService;
  let articleRepository: ArticleRepository;
  let categoryRepository: CategoryRepository;
  let commentRepository: CommentRepository;

  let JWT;
  let anotherJWT;
  let noviceJWT;

  const categoryName = '자유게시판';
  const articleTitle = '제목';
  const articleContent = '본문';
  const commentContent = '재밌다';
  let category;
  let cadetUser;
  let anotherCadetUser;
  let noviceUser;
  let targetArticle;

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
    cadetUser = dummy.user(
      'githubUid',
      'nickname',
      'githubUsername',
      UserRole.CADET,
    );
    await userRepository.save(cadetUser);
    JWT = dummy.jwt(cadetUser.id, cadetUser.role, authService);

    anotherCadetUser = dummy.user(
      'anothergithubUid',
      'nickname',
      'anotherGHusername',
      UserRole.CADET,
    );
    await userRepository.save(anotherCadetUser);
    anotherJWT = dummy.jwt(
      anotherCadetUser.id,
      anotherCadetUser.role,
      authService,
    );

    noviceUser = dummy.user(
      'novicegithubUid',
      'nickname',
      'noviceGHUsername',
      UserRole.NOVICE,
    );
    await userRepository.save(noviceUser);
    noviceJWT = dummy.jwt(noviceUser.id, noviceUser.role, authService);

    category = dummy.category(categoryName);
    await categoryRepository.save(category);

    targetArticle = dummy.article(
      category.id,
      cadetUser.id,
      articleTitle,
      articleContent,
    );
    await articleRepository.save(targetArticle);
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

    test('[실패] POST - 권한 없는 유저가 댓글 생성', async () => {
      const response = await request(httpServer)
        .post('/comments')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${noviceJWT}`)
        .send({ content: commentContent, articleId: targetArticle.id });

      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });
  });

  describe('/comments/:id', () => {
    let comment;

    beforeEach(async () => {
      comment = dummy.comment(cadetUser.id, targetArticle.id, commentContent);
      await commentRepository.save(comment);
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

    test('[실패] PUT - 권한 없는 유저가 댓글 수정', async () => {
      const response = await request(httpServer)
        .delete(`/comments/${comment.id}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${noviceJWT}`);

      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
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

    test('[성공] DELETE - 권한 없는 유저가 댓글 삭제', async () => {
      const response = await request(httpServer)
        .delete(`/comments/${comment.id}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${noviceJWT}`);

      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    test('[실패] PUT - 삭제된 댓글 수정', async () => {
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

    test.skip('[실패] DELETE - 삭제된 것을 또 삭제', async () => {
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
