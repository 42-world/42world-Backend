import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import * as cookieParser from 'cookie-parser';

import { AuthModule } from '@auth/auth.module';
import { UserModule } from '@user/user.module';
import { UserRepository } from '@user/repositories/user.repository';
import { UserRole } from '@user/entities/user.entity';
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

  beforeEach(async () => {
    const newUser = dummy.user('test1234', 'first user', UserRole.CADET);
    await userRepository.save(newUser);

    const newUser2 = dummy.user('test1234', 'second user', UserRole.CADET);
    await userRepository.save(newUser2);

    JWT = authService.getJWT({
      userId: newUser.id,
      userRole: newUser.role,
    } as JWTPayload);

    const newCategory = dummy.category('자유게시판');
    await categoryRepository.save(newCategory);

    const newArticle = dummy.article(newCategory.id, newUser.id, 'a', 'bb');
    await articleRepository.save(newArticle);

    const newArticle2 = dummy.article(newCategory.id, newUser2.id, 'a2', 'bb2');
    await articleRepository.save(newArticle2);

    const newComment = dummy.comment(newUser.id, newArticle.id, 'cc');
    await commentRepository.save(newComment);

    const newReactionArticle = dummy.reactionArticle(newArticle.id, newUser.id);
    await reactionArticleRepository.save(newReactionArticle);
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    await getConnection().close();
    await app.close();
  });

  beforeEach(async () => {
    await clearDB();
  });

  it('내 정보 가져오기', async () => {
    const response = await request(app)
      .get('/users/me')
      .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

    expect(response.status).toEqual(200);
  });

  it('특정 유저 정보 가져오기', async () => {
    const response = await request(app)
      .get('/users/2')
      .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

    expect(response.status).toEqual(200);
    expect(response.body.id).toEqual(2);
  });

  it('유저 프로필 변경', async () => {
    const updateData = {
      nickname: 'rockpell',
      character: 2,
    } as UpdateUserDto;

    const response = await request(app)
      .put('/users')
      .send(updateData)
      .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

    expect(response.status).toEqual(200);

    const updatedUser = await userRepository.findOne(1);
    expect(updatedUser.nickname).toEqual('rockpell');
    expect(updatedUser.character).toEqual(2);
  });

  it('유저 삭제하기', async () => {
    const response = await request(app)
      .delete('/users')
      .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

    expect(response.status).toEqual(200);

    const deletedUser = await userRepository.findOne(1, { withDeleted: true });

    expect(deletedUser.deletedAt).toBeTruthy();
  });

  it('내가 작성한 글 가져오기', async () => {
    const response = await request(app)
      .get('/users/me/articles')
      .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

    expect(response.status).toEqual(200);

    const articles = response.body.data as Article[];

    expect(articles[0].title).toEqual('a');
  });

  it('내가 작성한 댓글 가져오기', async () => {
    const response = await request(app)
      .get('/users/me/comments')
      .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

    expect(response.status).toEqual(200);

    const comments = response.body.data as Comment[];

    expect(comments.length).toEqual(1);
    expect(comments[0].content).toEqual('cc');
  });

  it('내가 좋아요 누른 게시글 목록 확인', async () => {
    const response = await request(app)
      .get('/users/me/like-articles')
      .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

    expect(response.status).toEqual(200);

    const articles = response.body.data as Article[];

    expect(articles.length).toEqual(1);
    expect(articles[0].id).toEqual(1);
  });
});
