import { ArticleModule } from '@article/article.module';
import { Article } from '@article/entities/article.entity';
import { ArticleRepository } from '@article/repositories/article.repository';
import { AuthModule } from '@auth/auth.module';
import { AuthService } from '@auth/auth.service';
import { JWTPayload } from '@auth/interfaces/jwt-payload.interface';
import { CategoryModule } from '@category/category.module';
import { CategoryRepository } from '@category/repositories/category.repository';
import { CommentModule } from '@comment/comment.module';
import { Comment } from '@comment/entities/comment.entity';
import { CommentRepository } from '@comment/repositories/comment.repository';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeormExceptionFilter } from '@root/filters/typeorm-exception.filter';
import { ReactionModule } from '@root/reaction/reaction.module';
import { ReactionArticleRepository } from '@root/reaction/repositories/reaction-article.repository';
import { UpdateUserProfileRequestDto } from '@root/user/dto/request/update-user-profile-request.dto';
import { UserRole } from '@root/user/interfaces/userrole.interface';
import * as dummy from '@test/e2e/utils/dummy';
import { clearDB } from '@test/e2e/utils/utils';
import { User } from '@user/entities/user.entity';
import { UserRepository } from '@user/repositories/user.repository';
import { UserModule } from '@user/user.module';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { TestBaseModule } from './test.base.module';

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
      const user = dummy.user(
        'test github uid',
        'test nickname',
        'github user name',
        UserRole.CADET,
      );
      await userRepository.save(user);

      JWT = authService.getJWT({
        userId: user.id,
        userRole: user.role,
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
    let user: User;

    beforeEach(async () => {
      user = dummy.user(
        'test github uid',
        'test nickname',
        'github user name',
        UserRole.CADET,
      );
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

    test('[실패] GET - 없는 유저 id를 요청한 경우', async () => {
      const response = await request(app)
        .get(`/users/${999}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      // 404를 던지는게 원래 맞는 건가요
      // TODO - 스웨거에 반영하기
      expect(response.status).toEqual(404);
    });
  });

  describe('/users', () => {
    let user: User;
    let user2: User;

    beforeEach(async () => {
      user = dummy.user(
        'test github uid',
        'test nickname',
        'github user name',
        UserRole.CADET,
      );
      user2 = dummy.user(
        'test github uid2',
        'test nickname2',
        'github user name2',
        UserRole.CADET,
      );
      await userRepository.save(user);
      await userRepository.save(user2);
      JWT = authService.getJWT({
        userId: user.id,
        userRole: user.role,
      } as JWTPayload);
    });

    test('[성공] PUT - 유저 프로필 변경', async () => {
      const updateData = {
        nickname: 'rockpell',
        character: 2,
      } as UpdateUserProfileRequestDto;
      const response = await request(app)
        .put('/users')
        .send(updateData)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(200);

      const updatedUser = await userRepository.findOne(user.id);
      expect(updatedUser.nickname).toEqual('rockpell');
      expect(updatedUser.character).toEqual(2);
    });

    test('[성공] PUT - 중복된 닉네임인 경우', async () => {
      // nickname2는 유저2의 닉네임이다
      const updateData = {
        nickname: user2.nickname,
        character: 2,
      } as UpdateUserProfileRequestDto;
      const response = await request(app)
        .put('/users')
        .send(updateData)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(200);

      const updatedUser = await userRepository.findOne(user.id);
      expect(updatedUser.nickname).toEqual(user2.nickname);
      expect(updatedUser.character).toEqual(2);
    });

    // TODO - 이게 올바른 동작인지 확인
    test('[성공] PUT - 닉네임 길이가 0인 경우', async () => {
      const updateData = {
        nickname: '',
        character: 2,
      } as UpdateUserProfileRequestDto;
      const response = await request(app)
        .put('/users')
        .send(updateData)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(200);

      const updatedUser = await userRepository.findOne(user.id);
      expect(updatedUser.nickname).toEqual('');
      expect(updatedUser.character).toEqual(2);
    });

    test('[성공] PUT - 닉네임만 변경하는 경우', async () => {
      const updateData = {
        nickname: 'mimseong',
      } as UpdateUserProfileRequestDto;
      const response = await request(app)
        .put('/users')
        .send(updateData)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(200);

      const updatedUser = await userRepository.findOne(user.id);
      expect(updatedUser.nickname).toEqual('mimseong');
      expect(updatedUser.character).toEqual(0);
    });

    test('[성공] PUT - 캐릭터만 변경하는 경우', async () => {
      const updateData = {
        character: 2,
      } as UpdateUserProfileRequestDto;
      const response = await request(app)
        .put('/users')
        .send(updateData)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(200);

      const updatedUser = await userRepository.findOne(user.id);
      expect(updatedUser.nickname).toEqual(user.nickname);
      expect(updatedUser.character).toEqual(2);
    });

    test('[실패] PUT - 없는 캐릭터 번호', async () => {
      const updateData = {
        nickname: 'rockpell',
        character: 999,
      } as UpdateUserProfileRequestDto;
      const response = await request(app)
        .put('/users')
        .send(updateData)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      // TODO - 스웨거에 반영하기
      expect(response.status).toEqual(400);

      const updatedUser = await userRepository.findOne(user.id);
      expect(updatedUser.nickname).toEqual(user.nickname);
      expect(updatedUser.character).toEqual(0);
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
    let user: User;
    let category;
    let article;

    beforeEach(async () => {
      user = dummy.user(
        'test github uid',
        'test nickname',
        'github user name',
        UserRole.CADET,
      );
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
      user = dummy.user(
        'test1234',
        'first user',
        'githubUsername',
        UserRole.CADET,
      );
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
      user = dummy.user(
        'test1234',
        'first user',
        'githubUsername',
        UserRole.CADET,
      );
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
