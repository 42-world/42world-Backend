import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import * as cookieParser from 'cookie-parser';

import { AuthModule } from '@auth/auth.module';
import { UserModule } from '@user/user.module';
import { EntityNotFoundExceptionFilter } from '@root/filters/entity-not-found-exception.filter';
import { UserRepository } from '@user/repositories/user.repository';
import { User, UserRole } from '@user/entities/user.entity';
import { JWTPayload } from '@auth/interfaces/jwt-payload.interface';
import { AuthService } from '@auth/auth.service';
import { TestBaseModule } from './test.base.module';
import { UpdateUserDto } from '@user/dto/update-user.dto';
import { ArticleModule } from '@article/article.module';
import { ArticleRepository } from '@article/repositories/article.repository';
import { Article } from '@article/entities/article.entity';
import { CategoryModule } from '@category/category.module';
import { Category } from '@category/entities/category.entity';
import { CategoryRepository } from '@category/repositories/category.repository';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let userRepository: UserRepository;
  let articleRepository: ArticleRepository;
  let categoryRepository: CategoryRepository;
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
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());

    app.useGlobalFilters(new EntityNotFoundExceptionFilter());
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
    newArticle.categoryId = 1;
    newArticle.writerId = 1;

    await articleRepository.save(newArticle);
  });

  afterEach(async () => {
    await userRepository.clear();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    await getConnection().close();
    await app.close();
  });

  it('내 정보 가져오기', async () => {
    const response = await request(app)
      .get('/users/me')
      .set('Cookie', `access_token=${JWT}`);

    expect(response.status).toEqual(200);
  });

  it('특정 유저 정보 가져오기', async () => {
    const response = await request(app)
      .get('/users/2')
      .set('Cookie', `access_token=${JWT}`);

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
      .set('Cookie', `access_token=${JWT}`);

    expect(response.status).toEqual(200);

    const updatedUser = await userRepository.findOne(1);
    expect(updatedUser.nickname).toEqual('rockpell');
    expect(updatedUser.character).toEqual(2);
  });

  it('유저 삭제하기', async () => {
    const response = await request(app)
      .delete('/users')
      .set('Cookie', `access_token=${JWT}`);

    expect(response.status).toEqual(200);

    const deletedUser = await userRepository.findOne(1, { withDeleted: true });

    expect(deletedUser.deletedAt).toBeTruthy();
  });

  it('내가 작성한 글 가져오기', async () => {
    const response = await request(app)
      .get('/users/me/articles')
      .set('Cookie', `access_token=${JWT}`);

    expect(response.status).toEqual(200);

    const articles = response.body;

    expect(articles[0].title).toEqual('a');
  });
});
