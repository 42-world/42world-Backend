import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';

import { UserRepository } from '@user/repositories/user.repository';
import { AuthService } from '@auth/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from '@user/user.module';
import { AuthModule } from '@auth/auth.module';
import { TypeormExceptionFilter } from '@root/filters/typeorm-exception.filter';
import { ImageModule } from '@image/image.module';
import { getConnection } from 'typeorm';
import { UploadImageUrlResponseDto } from '@image/dto/upload-image-url-response.dto';
import { TestBaseModule } from '@test/e2e/test.base.module';
import { clearDB } from '@test/e2e/utils/utils';
import * as dummy from './utils/dummy';
import { UserRole } from '@root/user/interfaces/userrole.interface';
import { InternalServerErrorExceptionFilter } from '@root/filters/internal-server-error-exception.filter';
import { CategoryModule } from '@root/category/category.module';
import { User } from '@root/user/entities/user.entity';
import { Category } from '@root/category/entities/category.entity';
import { CreateCategoryRequestDto } from '@root/category/dto/request/create-category-request.dto';
import { CategoryResponseDto } from '@root/category/dto/response/category-response.dto';

describe('Category', () => {
  let app: INestApplication;
  let userRepository: UserRepository;
  let authService: AuthService;
  let JWT;
  let dummyUsers: User[] = [];
  let dummyCategories: Category[];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestBaseModule, UserModule, AuthModule, CategoryModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());

    app.useGlobalFilters(new InternalServerErrorExceptionFilter());
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
    authService = moduleFixture.get<AuthService>(AuthService);

    app = app.getHttpServer();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    await getConnection().close();
    await app.close();
  });

  describe('/categories', () => {
    dummyUsers.push(
      dummy.user('test1234', 'first user', 'githubUsername', UserRole.CADET),
    );
    dummyUsers.push(
      dummy.user('test1234', 'second user', 'githubUsername2', UserRole.ADMIN),
    );

    beforeEach(async () => {
      await userRepository.save(dummyUsers);

      // JWT = dummy.jwt(dummyUsers[1].id, dummyUsers[1].role, authService);
    });

    afterEach(async () => {
      await clearDB();
    });

    test('[성공] POST - 카테고리 생성', async () => {
      const jwt = dummy.jwt(dummyUsers[1].id, dummyUsers[1].role, authService);
      const createCategoryRequestDto: CreateCategoryRequestDto = {
        name: 'hello',
      };
      const response = await request(app)
        .post('/categories')
        .send(createCategoryRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${jwt}`);
      expect(response.status).toEqual(201);

      const result = response.body as CategoryResponseDto;

      expect(result.id).toBeDefined();
      expect(result.name).toBe('hello');
      expect(result.isArticleWritable).toBe(true);
      expect(result.isArticleReadable).toBe(true);
      expect(result.isCommentWritable).toBe(true);
      expect(result.isCommentReadable).toBe(true);
      expect(result.isReactionable).toBe(true);
      expect(result.isAnonymous).toBe(false);
    });

    // test('[실패] POST - unauthorized', async () => {
    //   const response = await request(app).post('/image');

    //   expect(response.status).toEqual(401);
    // });
  });
});
