import { ArticleModule } from '@api/article/article.module';
import { ArticleRepository } from '@api/article/repositories/article.repository';
import { AuthModule } from '@api/auth/auth.module';
import { AuthService } from '@api/auth/auth.service';
import { CategoryModule } from '@api/category/category.module';
import { CategoryRepository } from '@api/category/repositories/category.repository';
import { CommentModule } from '@api/comment/comment.module';
import { CommentRepository } from '@api/comment/repositories/comment.repository';
import { ReactionModule } from '@api/reaction/reaction.module';
import { ReactionArticleRepository } from '@api/reaction/repositories/reaction-article.repository';
import { UpdateUserProfileRequestDto } from '@api/user/dto/request/update-user-profile-request.dto';
import { UserResponseDto } from '@api/user/dto/response/user-response.dto';
import { UserRepository } from '@api/user/repositories/user.repository';
import { UserModule } from '@api/user/user.module';
import { Article } from '@app/entity/article/article.entity';
import { Category } from '@app/entity/category/category.entity';
import { Comment } from '@app/entity/comment/comment.entity';
import { ReactionArticle } from '@app/entity/reaction/reaction-article.entity';
import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { User } from '@app/entity/user/user.entity';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as dummy from '@test/e2e/utils/dummy';
import { clearDB, createTestApp } from '@test/e2e/utils/utils';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { TestBaseModule } from './test.base.module';

describe('User', () => {
  let httpServer: INestApplication;

  let userRepository: UserRepository;
  let articleRepository: ArticleRepository;
  let categoryRepository: CategoryRepository;
  let commentRepository: CommentRepository;
  let reactionArticleRepository: ReactionArticleRepository;

  let authService: AuthService;
  let JWT: string;

  let users: dummy.DummyUsers;

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
    reactionArticleRepository = moduleFixture.get(ReactionArticleRepository);
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

  describe('/users/me', () => {
    beforeEach(async () => {
      const user = dummy.user(
        'test github uid',
        'test nickname',
        'github user name',
        UserRole.CADET,
      );
      await userRepository.save(user);

      JWT = dummy.jwt(user, authService);
    });

    test('[성공] GET - 내 정보 가져오기', async () => {
      const response = await request(httpServer)
        .get('/users/me')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(HttpStatus.OK);
    });
  });

  describe('/users/{id}', () => {
    let user: User;
    beforeEach(async () => {
      users = await dummy.createDummyUsers(userRepository);
      JWT = dummy.jwt(users.cadet[0], authService);
      user = users.cadet[0];
    });

    test('[성공] GET - 특정 유저 정보 가져오기', async () => {
      const response = await request(httpServer)
        .get(`/users/${user.id}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(HttpStatus.OK);
      const userResponse = response.body as UserResponseDto;
      expect(userResponse.id).toEqual(user.id);
      expect(userResponse.nickname).toEqual(user.nickname);
      expect(userResponse.role).toEqual(user.role);
      expect(userResponse.character).toEqual(user.character);
    });

    test('[실패] GET - 없는 유저 id를 요청한 경우', async () => {
      const response = await request(httpServer)
        .get(`/users/${999}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      // TODO - 스웨거에 반영하기
      expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    });
  });

  describe('/users', () => {
    let user: User;
    let user2: User;
    const updatedNickname = 'updated nickname';
    const updatedCharacter = 2;

    beforeEach(async () => {
      users = await dummy.createDummyUsers(userRepository);
      user = users.cadet[0];
      user2 = users.cadet[1];
      JWT = dummy.jwt(user, authService);
    });

    test('[성공] PUT - 유저 프로필 변경', async () => {
      const updateData = {
        nickname: updatedNickname,
        character: updatedCharacter,
      } as UpdateUserProfileRequestDto;
      const response = await request(httpServer)
        .put('/users')
        .send(updateData)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(HttpStatus.OK);

      const updatedUser = await userRepository.findOne(user.id);
      expect(updatedUser.nickname).toEqual(updatedNickname);
      expect(updatedUser.character).toEqual(updatedCharacter);
    });

    test('[성공] PUT - 중복된 닉네임인 경우', async () => {
      // nickname2는 유저2의 닉네임이다
      const updateData = {
        nickname: user2.nickname,
        character: updatedCharacter,
      } as UpdateUserProfileRequestDto;
      const response = await request(httpServer)
        .put('/users')
        .send(updateData)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(HttpStatus.OK);

      const updatedUser = await userRepository.findOne(user.id);
      expect(updatedUser.nickname).toEqual(user2.nickname);
      expect(updatedUser.character).toEqual(updatedCharacter);
    });

    // TODO - 로직 수정
    test.skip('[성공] PUT - 닉네임 길이가 0인 경우', async () => {
      const updateData = {
        nickname: '',
        character: updatedCharacter,
      } as UpdateUserProfileRequestDto;
      const response = await request(httpServer)
        .put('/users')
        .send(updateData)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    test('[성공] PUT - 닉네임만 변경하는 경우', async () => {
      const updateData = {
        nickname: updatedNickname,
      } as UpdateUserProfileRequestDto;
      const response = await request(httpServer)
        .put('/users')
        .send(updateData)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(HttpStatus.OK);

      const updatedUser = await userRepository.findOne(user.id);
      expect(updatedUser.nickname).toEqual(updatedNickname);
      expect(updatedUser.character).toEqual(user.character);
    });

    test('[성공] PUT - 캐릭터만 변경하는 경우', async () => {
      const updateData = {
        character: updatedCharacter,
      } as UpdateUserProfileRequestDto;
      const response = await request(httpServer)
        .put('/users')
        .send(updateData)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(HttpStatus.OK);

      const updatedUser = await userRepository.findOne(user.id);
      expect(updatedUser.nickname).toEqual(user.nickname);
      expect(updatedUser.character).toEqual(updatedCharacter);
    });

    test('[실패] PUT - 없는 캐릭터 번호', async () => {
      const updateData = {
        nickname: updatedNickname,
        character: 999,
      } as UpdateUserProfileRequestDto;
      const response = await request(httpServer)
        .put('/users')
        .send(updateData)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      // TODO - 스웨거에 반영하기
      expect(response.status).toEqual(HttpStatus.BAD_REQUEST);

      const updatedUser = await userRepository.findOne(user.id);
      expect(updatedUser.nickname).toEqual(user.nickname);
      expect(updatedUser.character).toEqual(user.character);
    });

    test('[성공] DELETE - 유저 삭제하기', async () => {
      const response = await request(httpServer)
        .delete('/users')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(HttpStatus.OK);

      const deletedUser = await userRepository.findOne(user.id, {
        withDeleted: true,
      });

      expect(deletedUser.deletedAt).toBeTruthy();
    });
  });

  describe('/users/me/articles', () => {
    let user: User;
    let category: Category;
    let article: Article;

    beforeEach(async () => {
      users = await dummy.createDummyUsers(userRepository);
      user = users.cadet[0];
      JWT = dummy.jwt(user, authService);

      category = dummy.category('자유게시판');
      await categoryRepository.save(category);
      article = dummy.article(category.id, user.id, 'title', 'content');
      await articleRepository.save(article);
    });

    test('[성공] GET - 내가 작성한 글 가져오기', async () => {
      const response = await request(httpServer)
        .get('/users/me/articles')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(HttpStatus.OK);

      const articles = response.body.data as Article[];

      expect(articles[0].title).toEqual(article.title);
      // expect(articles[0].category.id).toEqual(article.category.id);
      // expect(articles[0].writer.id).toEqual(article.writer.id);
      // expect(articles[0].writer.nickname).toEqual(article.writer.nickname);
    });

    test.skip('[성공] GET - 내가 작성한 글 가져오기 - 익명', async () => {
      expect(1).toBeTruthy();
    });
  });

  describe('/users/me/comments', () => {
    let user: User;
    let category: Category;
    let article: Article;
    let comment: Comment;

    beforeEach(async () => {
      users = await dummy.createDummyUsers(userRepository);
      user = users.cadet[0];
      JWT = dummy.jwt(user, authService);

      category = dummy.category('자유게시판');
      await categoryRepository.save(category);
      article = dummy.article(category.id, user.id, 'title', 'content');
      await articleRepository.save(article);
      comment = dummy.comment(user.id, user.id, 'content');
      await commentRepository.save(comment);
    });

    test('[성공] GET - 내가 작성한 댓글 가져오기', async () => {
      const response = await request(httpServer)
        .get('/users/me/comments')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(HttpStatus.OK);

      const comments = response.body.data as Comment[];

      expect(comments.length).toEqual(1);
      expect(comments[0].content).toEqual(comment.content);
    });

    test.skip('[성공] GET - 내가 작성한 댓글 가져오기 - 익명', async () => {
      expect(1).toBeTruthy();
    });
  });

  describe('/users/me/like-articles', () => {
    let user: User;
    let category: Category;
    let article: Article;
    let comment: Comment;
    let reactionArticle: ReactionArticle;

    beforeEach(async () => {
      users = await dummy.createDummyUsers(userRepository);
      user = users.cadet[0];
      JWT = dummy.jwt(user, authService);

      category = dummy.category('자유게시판');
      await categoryRepository.save(category);
      article = dummy.article(category.id, user.id, 'title', 'content');
      await articleRepository.save(article);
      comment = dummy.comment(user.id, user.id, 'content');
      await commentRepository.save(comment);
      reactionArticle = dummy.reactionArticle(article.id, user.id);
      await reactionArticleRepository.save(reactionArticle);
    });

    test('[성공] GET - 내가 좋아요 누른 게시글 목록 확인', async () => {
      const response = await request(httpServer)
        .get('/users/me/like-articles')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      expect(response.status).toEqual(HttpStatus.OK);

      const articles = response.body.data as Article[];

      expect(articles.length).toEqual(1);
      expect(articles[0].id).toEqual(reactionArticle.id);
    });

    test.skip('[성공] GET - 내가 좋아요 누른 게시글 목록 확인 - 익명', async () => {
      expect(1).toBeTruthy();
    });
  });
});
