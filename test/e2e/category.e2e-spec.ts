import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
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
import { CategoryRepository } from '@root/category/repositories/category.repository';

describe('Category', () => {
  let app: INestApplication;
  let userRepository: UserRepository;
  let categoryRepository: CategoryRepository;
  let authService: AuthService;
  let JWT;
  let dummyUsers: User[] = [];
  let dummyCategories: Category[] = [];
  let server: INestApplication;

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

    userRepository = moduleFixture.get(UserRepository);
    categoryRepository = moduleFixture.get(CategoryRepository);
    authService = moduleFixture.get(AuthService);

    server = app.getHttpServer();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    await getConnection().close();
    await server.close();
  });

  describe('/categories', () => {
    dummyUsers.push(dummy.user('admin', 'admin', 'admin', UserRole.ADMIN));
    dummyUsers.push(dummy.user('cadet', 'cadet', 'cadet', UserRole.CADET));
    dummyUsers.push(dummy.user('novice', 'novice', 'novice', UserRole.NOVICE));

    dummyCategories.push(dummy.category('자유게시판'));
    dummyCategories.push(dummy.category('익명게시판'));
    dummyCategories.push(dummy.category('유머게시판'));
    beforeEach(async () => {
      await userRepository.save(dummyUsers);
      await categoryRepository.save(dummyCategories);
    });

    afterEach(async () => {
      await clearDB();
    });

    test('[성공] POST - ADMIN이 카테고리 생성', async () => {
      const jwt = dummy.jwt(dummyUsers[0].id, dummyUsers[0].role, authService);
      const createCategoryRequestDto: CreateCategoryRequestDto = {
        name: 'new_category',
      };
      const response = await request(server)
        .post('/categories')
        .send(createCategoryRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${jwt}`);
      expect(response.status).toEqual(HttpStatus.CREATED);

      const catetory = response.body as CategoryResponseDto;

      expect(catetory.id).toBeDefined();
      expect(catetory.name).toBe('new_category');
      expect(catetory.isArticleWritable).toBe(true);
      expect(catetory.isArticleReadable).toBe(true);
      expect(catetory.isCommentWritable).toBe(true);
      expect(catetory.isCommentReadable).toBe(true);
      expect(catetory.isReactionable).toBe(true);
      expect(catetory.isAnonymous).toBe(false);
    });

    test('[실패] POST - CADET이 카테고리 생성', async () => {
      const jwt = dummy.jwt(dummyUsers[1].id, dummyUsers[1].role, authService);
      const createCategoryRequestDto: CreateCategoryRequestDto = {
        name: 'new_category',
      };
      const response = await request(server)
        .post('/categories')
        .send(createCategoryRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${jwt}`);
      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    test('[실패] POST - NOVICE가 카테고리 생성', async () => {
      const jwt = dummy.jwt(dummyUsers[2].id, dummyUsers[2].role, authService);
      const createCategoryRequestDto: CreateCategoryRequestDto = {
        name: 'new_category',
      };
      const response = await request(server)
        .post('/categories')
        .send(createCategoryRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${jwt}`);
      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    test('[실패] POST - unauthorized', async () => {
      const response = await request(server).post('/categories');

      expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    test('[성공] GET - ADMIN이 카테고리 종류 가져오기', async () => {
      const jwt = dummy.jwt(dummyUsers[0].id, dummyUsers[0].role, authService);

      const response = await request(server)
        .get('/categories')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${jwt}`);
      expect(response.status).toEqual(HttpStatus.OK);

      const categories = response.body as CategoryResponseDto[];

      expect(categories).toBeInstanceOf(Array);
      expect(categories[0].name).toBe('자유게시판');
      expect(categories[1].name).toBe('익명게시판');
      expect(categories[2].name).toBe('유머게시판');
    });

    test('[성공] GET - CADET이 카테고리 종류 가져오기', async () => {
      const jwt = dummy.jwt(dummyUsers[1].id, dummyUsers[1].role, authService);

      const response = await request(server)
        .get('/categories')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${jwt}`);
      expect(response.status).toEqual(HttpStatus.OK);

      const categories = response.body as CategoryResponseDto[];

      expect(categories).toBeInstanceOf(Array);
      expect(categories[0].name).toBe('자유게시판');
      expect(categories[1].name).toBe('익명게시판');
      expect(categories[2].name).toBe('유머게시판');
    });

    test('[실패] GET - NOVICE가 카테고리 종류 가져오기', async () => {
      const jwt = dummy.jwt(dummyUsers[2].id, dummyUsers[2].role, authService);

      const response = await request(server)
        .get('/categories')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${jwt}`);
      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    test('[실패] GET - unauthorized', async () => {
      const response = await request(server).get('/categories');

      expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    test('[성공] PUT - ADMIN이 카테고리 이름 수정', async () => {
      const jwt = dummy.jwt(dummyUsers[0].id, dummyUsers[0].role, authService);
      const createCategoryRequestDto: CreateCategoryRequestDto = {
        name: 'update_category',
      };
      const id = 2;
      const response = await request(server)
        .put(`/categories/${id}/name`)
        .send(createCategoryRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${jwt}`);
      expect(response.status).toEqual(HttpStatus.OK);

      const category = response.body as CategoryResponseDto;

      expect(category.id).toBe(2);
      expect(category.name).toBe('update_category');
    });

    test('[실패] PUT - CADET이 카테고리 이름 수정', async () => {
      const jwt = dummy.jwt(dummyUsers[1].id, dummyUsers[1].role, authService);
      const id = 2;
      const response = await request(server)
        .put(`/categories/${id}/name`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${jwt}`);
      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    test('[실패] PUT - NOVICE가 카테고리 이름 수정', async () => {
      const jwt = dummy.jwt(dummyUsers[2].id, dummyUsers[2].role, authService);
      const id = 2;
      const response = await request(server)
        .put(`/categories/${id}/name`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${jwt}`);
      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    test('[실패] PUT - unauthorized', async () => {
      const id = 1;
      const response = await request(server).put(`/categories/${id}/name`);

      expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    test('[성공] DELETE - ADMIN이 카테고리 삭제', async () => {
      const jwt = dummy.jwt(dummyUsers[0].id, dummyUsers[0].role, authService);
      const id = 1;
      const response = await request(server)
        .delete(`/categories/${id}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${jwt}`);
      expect(response.status).toEqual(HttpStatus.OK);
    });

    test('[실패] DELETE - CADET이 카테고리 삭제', async () => {
      const jwt = dummy.jwt(dummyUsers[1].id, dummyUsers[1].role, authService);
      const id = 1;
      const response = await request(server)
        .delete(`/categories/${id}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${jwt}`);
      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    test('[실패] DELETE - NOVICE가 카테고리 삭제', async () => {
      const jwt = dummy.jwt(dummyUsers[2].id, dummyUsers[2].role, authService);
      const id = 1;
      const response = await request(server)
        .delete(`/categories/${id}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${jwt}`);
      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    test('[실패] DELETE - unauthorized', async () => {
      const id = 1;
      const response = await request(server).delete(`/categories/${id}`);

      expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });
  });
});
