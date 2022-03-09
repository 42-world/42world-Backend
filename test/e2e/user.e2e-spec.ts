import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import * as cookieParser from 'cookie-parser';

import { AuthModule } from '@auth/auth.module';
import { UserModule } from '@user/user.module';
import { UserRepository } from '@user/repositories/user.repository';
import { User } from '@user/entities/user.entity';
import { JWTPayload } from '@auth/interfaces/jwt-payload.interface';
import { AuthService } from '@auth/auth.service';
import { TestBaseModule } from './test.base.module';
import { TypeormExceptionFilter } from '@root/filters/typeorm-exception.filter';
import { UpdateUserDto } from '@user/dto/update-user.dto';
import { ArticleModule } from '@article/article.module';
import { ArticleRepository } from '@article/repositories/article.repository';
import { Article } from '@article/entities/article.entity';
import { CategoryModule } from '@category/category.module';
import { CategoryRepository } from '@category/repositories/category.repository';
import { Comment } from '@comment/entities/comment.entity';
import { CommentModule } from '@comment/comment.module';
import { CommentRepository } from '@comment/repositories/comment.repository';
import { ReactionModule } from '@root/reaction/reaction.module';
import { ReactionArticleRepository } from '@root/reaction/repositories/reaction-article.repository';
import { UserRole } from '@root/user/interfaces/userrole.interface';
import { clearDB } from '@test/e2e/utils/utils';
import * as dummy from '@test/e2e/utils/dummy';

describe('UserController (e2e)', () => {
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

  beforeEach(async () => {
    await clearDB();
  });

  describe('/users/me', () => {
    beforeEach(async () => {
      const newUser = dummy.user('test1234', 'first user', UserRole.CADET);
      await userRepository.save(newUser);

      JWT = authService.getJWT({
        userId: newUser.id,
        userRole: newUser.role,
      } as JWTPayload);
    });

    test('[성공] GET - 내 정보 가져오기', async () => {
      const response = await request(app)
        .get('/users/me')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(200);
    });
  });

  describe('/users/{id}', () => {
    let user;

    beforeEach(async () => {
      user = dummy.user('test1234', 'first user', UserRole.CADET);
      await userRepository.save(user);
      JWT = authService.getJWT({
        userId: user.id,
        userRole: user.role,
      } as JWTPayload);
    });

    test('[성공] GET - 특정 유저 정보 가져오기', async () => {
      const response = await request(app)
        .get(`/users/${user.id}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(200);
      expect(response.body.id).toEqual(user.id);
      expect(response.body.nickname).toEqual(user.nickname);
    });
  });

  describe('/users', () => {
    let user;

    beforeEach(async () => {
      user = dummy.user('test1234', 'first user', UserRole.CADET);
      await userRepository.save(user);
      JWT = authService.getJWT({
        userId: user.id,
        userRole: user.role,
      } as JWTPayload);
    });

    test('[성공] PUT - 유저 프로필 변경', async () => {
      const updateData = {
        nickname: 'rockpell',
        character: 2,
      } as UpdateUserDto;

      const response = await request(app)
        .put('/users')
        .send(updateData)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(200);

      const updatedUser = await userRepository.findOne(user.id);
      expect(updatedUser.nickname).toEqual('rockpell');
      expect(updatedUser.character).toEqual(2);
    });

    test('[성공] DELETE - 유저 삭제하기', async () => {
      const response = await request(app)
        .delete('/users')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(200);

      const deletedUser = await userRepository.findOne(user.id, {
        withDeleted: true,
      });

      expect(deletedUser.deletedAt).toBeTruthy();
    });
  });

  describe('/users/me/articles', () => {
    let user;
    let category;
    let article;

    beforeEach(async () => {
      user = dummy.user('test1234', 'first user', UserRole.CADET);
      await userRepository.save(user);
      JWT = authService.getJWT({
        userId: user.id,
        userRole: user.role,
      } as JWTPayload);

      category = dummy.category('자유게시판');
      await categoryRepository.save(category);
      article = dummy.article(category.id, user.id, 'a', 'bb');
      await articleRepository.save(article);
    });

    test('[성공] GET - 내가 작성한 글 가져오기', async () => {
      const response = await request(app)
        .get('/users/me/articles')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(200);

      const articles = response.body.data as Article[];

      expect(articles[0].title).toEqual(article.title);
    });
  });

  describe('/users/me/comments', () => {
    let user;
    let category;
    let article;
    let comment;

    beforeEach(async () => {
      user = dummy.user('test1234', 'first user', UserRole.CADET);
      await userRepository.save(user);
      JWT = authService.getJWT({
        userId: user.id,
        userRole: user.role,
      } as JWTPayload);

      category = dummy.category('자유게시판');
      await categoryRepository.save(category);
      article = dummy.article(category.id, user.id, 'a', 'bb');
      await articleRepository.save(article);
      comment = dummy.comment(user.id, user.id, 'cc');
      await commentRepository.save(comment);
    });

    test('[성공] GET - 내가 작성한 댓글 가져오기', async () => {
      const response = await request(app)
        .get('/users/me/comments')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(200);

      const comments = response.body.data as Comment[];

      expect(comments.length).toEqual(1);
      expect(comments[0].content).toEqual(comment.content);
    });
  });

  describe('/users/me/like-articles', () => {
    let user;
    let category;
    let article;
    let comment;
    let reactionArticle;

    beforeEach(async () => {
      user = dummy.user('test1234', 'first user', UserRole.CADET);
      await userRepository.save(user);
      JWT = authService.getJWT({
        userId: user.id,
        userRole: user.role,
      } as JWTPayload);

      category = dummy.category('자유게시판');
      await categoryRepository.save(category);
      article = dummy.article(category.id, user.id, 'a', 'bb');
      await articleRepository.save(article);
      comment = dummy.comment(user.id, user.id, 'cc');
      await commentRepository.save(comment);
      reactionArticle = dummy.reactionArticle(article.id, user.id);
      await reactionArticleRepository.save(reactionArticle);
    });

    test('[성공] GET - 내가 좋아요 누른 게시글 목록 확인', async () => {
      const response = await request(app)
        .get('/users/me/like-articles')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(200);

      const articles = response.body.data as Article[];

      expect(articles.length).toEqual(1);
      expect(articles[0].id).toEqual(reactionArticle.id);
    });
  });
});
