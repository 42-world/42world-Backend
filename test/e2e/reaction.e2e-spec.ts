import { ArticleModule } from '@article/article.module';
import { Article } from '@article/entities/article.entity';
import { ArticleRepository } from '@article/repositories/article.repository';
import { AuthModule } from '@auth/auth.module';
import { AuthService } from '@auth/auth.service';
import { JWTPayload } from '@auth/interfaces/jwt-payload.interface';
import { CategoryModule } from '@category/category.module';
import { Category } from '@category/entities/category.entity';
import { CategoryRepository } from '@category/repositories/category.repository';
import { CommentModule } from '@comment/comment.module';
import { Comment } from '@comment/entities/comment.entity';
import { CommentRepository } from '@comment/repositories/comment.repository';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeormExceptionFilter } from '@root/filters/typeorm-exception.filter';
import { ReactionModule } from '@root/reaction/reaction.module';
import { ReactionArticleRepository } from '@root/reaction/repositories/reaction-article.repository';
import { User, UserRole } from '@user/entities/user.entity';
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

  beforeEach(async () => {
    const newUser = new User();
    newUser.oauthToken = 'test1234';
    newUser.nickname = 'first user';
    newUser.role = UserRole.CADET;
    await userRepository.save(newUser);

    const newUser2 = new User();
    newUser2.oauthToken = 'test1234';
    newUser2.nickname = 'second user';
    newUser2.role = UserRole.CADET;
    await userRepository.save(newUser2);

    JWT = authService.getJWT({
      userId: newUser.id,
      userRole: newUser.role,
    } as JWTPayload);

    const newCategory = new Category();
    newCategory.name = '자유게시판';

    await categoryRepository.save(newCategory);

    const newArticle = new Article();
    newArticle.title = 'a';
    newArticle.content = 'bb';
    newArticle.categoryId = newCategory.id;
    newArticle.writerId = newUser.id;
    await articleRepository.save(newArticle);

    const newComment = new Comment();
    newComment.content = 'cc';
    newComment.writerId = newUser.id;
    newComment.articleId = newArticle.id;
    await commentRepository.save(newComment);
  });

  afterEach(async () => {
    await Promise.all([
      userRepository.clear(),
      articleRepository.clear(),
      commentRepository.clear(),
      categoryRepository.clear(),
      reactionArticleRepository.clear(),
    ]);
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    await getConnection().close();
    await app.close();
  });

  test('[성공] 게시글 리엑션 성공 - 좋아요가 없는 경우', async () => {
    const response = await request(app)
      .post('/reactions/articles/1')
      .set('Cookie', `access_token=${JWT}`);

    expect(response.status).toEqual(201);
    expect(response.body.isLike).toEqual(true);
    expect(response.body.likeCount).toEqual(1);
  });

  test('[성공] 게시글 리엑션 성공 - 좋아요가 있는 경우', async () => {
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

  test('[실패] 게시글 리엑션 실패 - unauthorize', async () => {
    const response2 = await request(app).post('/reactions/articles/1');

    expect(response2.status).toEqual(401);
  });
});
