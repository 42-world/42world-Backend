import { AuthModule } from '@api/auth/auth.module';
import { AuthService } from '@api/auth/auth.service';
import { CategoryModule } from '@api/category/category.module';
import { CreateCategoryRequestDto } from '@api/category/dto/request/create-category-request.dto';
import { CategoryResponseDto } from '@api/category/dto/response/category-response.dto';
import { CategoryRepository } from '@api/category/repositories/category.repository';
import { UserRepository } from '@api/user/repositories/user.repository';
import { UserModule } from '@api/user/user.module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { E2eTestBaseModule } from '@test/e2e/e2e-test.base.module';
import { clearDB, createTestApp } from '@test/e2e/utils/utils';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import * as dummy from './utils/dummy';

describe('Category', () => {
  let userRepository: UserRepository;
  let categoryRepository: CategoryRepository;
  let authService: AuthService;
  let jwt: { admin: string; cadet: string; novice: string };
  let server: INestApplication;
  let users: dummy.DummyUsers;
  let categories: dummy.DummyCategories;
  let paramId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [E2eTestBaseModule, UserModule, AuthModule, CategoryModule],
    }).compile();

    const app = createTestApp(moduleFixture);
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

  beforeEach(async () => {
    await clearDB();
  });

  describe('/categories', () => {
    beforeEach(async () => {
      users = await dummy.createDummyUsers(userRepository);
      categories = await dummy.createDummyCategories(categoryRepository);
      jwt = {
        admin: dummy.jwt(users.admin[0], authService),
        cadet: dummy.jwt(users.cadet[0], authService),
        novice: dummy.jwt(users.novice[0], authService),
      };
    });

    afterEach(async () => {
      delete jwt.admin;
      delete jwt.cadet;
      delete jwt.novice;
    });

    test('[성공] POST - ADMIN이 카테고리 생성', async () => {
      const createCategoryRequestDto: CreateCategoryRequestDto = {
        name: 'new_category',
      };
      const response = await request(server)
        .post('/categories')
        .send(createCategoryRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${jwt.admin}`);
      expect(response.status).toEqual(HttpStatus.CREATED);

      const responseCategory = response.body as CategoryResponseDto;

      expect(responseCategory.id).toBeDefined();
      expect(responseCategory.name).toBe('new_category');
      expect(responseCategory.isArticleWritable).toBe(true);
      expect(responseCategory.isArticleReadable).toBe(true);
      expect(responseCategory.isCommentWritable).toBe(true);
      expect(responseCategory.isCommentReadable).toBe(true);
      expect(responseCategory.isReactionable).toBe(true);
      expect(responseCategory.isAnonymous).toBe(false);
    });

    test('[실패] POST - CADET이 카테고리 생성', async () => {
      const createCategoryRequestDto: CreateCategoryRequestDto = {
        name: 'new_category',
      };
      const response = await request(server)
        .post('/categories')
        .send(createCategoryRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${jwt.cadet}`);
      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    test('[실패] POST - NOVICE가 카테고리 생성', async () => {
      const createCategoryRequestDto: CreateCategoryRequestDto = {
        name: 'new_category',
      };
      const response = await request(server)
        .post('/categories')
        .send(createCategoryRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${jwt.novice}`);
      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    test('[실패] POST - unauthorized', async () => {
      const response = await request(server).post('/categories');

      expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    test('[성공] GET - ADMIN이 카테고리 종류 가져오기', async () => {
      const response = await request(server)
        .get('/categories')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${jwt.admin}`);
      expect(response.status).toEqual(HttpStatus.OK);

      const responseCategories = response.body as CategoryResponseDto[];

      expect(responseCategories).toBeInstanceOf(Array);
      expect(responseCategories[0].name).toBe(categories.free.name);
      expect(responseCategories[1].name).toBe(categories.notice.name);
      expect(responseCategories[2].name).toBe(categories.forall.name);
      expect(responseCategories[3].name).toBe(categories.anony.name);
    });

    test('[성공] GET - CADET이 카테고리 종류 가져오기', async () => {
      const response = await request(server)
        .get('/categories')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${jwt.cadet}`);
      expect(response.status).toEqual(HttpStatus.OK);

      const responseCategories = response.body as CategoryResponseDto[];

      expect(responseCategories).toBeInstanceOf(Array);
      expect(responseCategories[0].name).toBe(categories.free.name);
      expect(responseCategories[1].name).toBe(categories.notice.name);
      expect(responseCategories[2].name).toBe(categories.forall.name);
      expect(responseCategories[3].name).toBe(categories.anony.name);
    });

    test('[성공] GET - NOVICE가 카테고리 종류 가져오기', async () => {
      const response = await request(server)
        .get('/categories')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${jwt.novice}`);
      expect(response.status).toEqual(HttpStatus.OK);

      const responseCategories = response.body as CategoryResponseDto[];

      expect(responseCategories).toBeInstanceOf(Array);
      expect(responseCategories[0].name).toBe(categories.free.name);
      expect(responseCategories[1].name).toBe(categories.notice.name);
      expect(responseCategories[2].name).toBe(categories.forall.name);
      expect(responseCategories[3].name).toBe(categories.anony.name);
    });

    test('[성공] GET - GUEST가 카테고리 종류 가져오기', async () => {
      const response = await request(server).get('/categories');
      expect(response.status).toEqual(HttpStatus.OK);

      const responseCategories = response.body as CategoryResponseDto[];

      expect(responseCategories).toBeInstanceOf(Array);
      expect(responseCategories[0].name).toBe(categories.free.name);
      expect(responseCategories[1].name).toBe(categories.notice.name);
      expect(responseCategories[2].name).toBe(categories.forall.name);
      expect(responseCategories[3].name).toBe(categories.anony.name);
    });
  });

  describe('/categories/{id}/name', () => {
    beforeEach(async () => {
      users = await dummy.createDummyUsers(userRepository);
      categories = await dummy.createDummyCategories(categoryRepository);
      paramId = 2;
      jwt = {
        admin: dummy.jwt(users.admin[0], authService),
        cadet: dummy.jwt(users.cadet[0], authService),
        novice: dummy.jwt(users.novice[0], authService),
      };
    });

    afterEach(async () => {
      delete jwt.admin;
      delete jwt.cadet;
      delete jwt.novice;
    });

    test('[성공] PUT - ADMIN이 카테고리 이름 수정', async () => {
      const createCategoryRequestDto: CreateCategoryRequestDto = {
        name: 'update_category',
      };
      const response = await request(server)
        .put(`/categories/${paramId}/name`)
        .send(createCategoryRequestDto)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${jwt.admin}`);
      expect(response.status).toEqual(HttpStatus.OK);

      const responseCategory = response.body as CategoryResponseDto;

      expect(responseCategory.id).toBe(paramId);
      expect(responseCategory.name).toBe('update_category');
    });

    test('[실패] PUT - CADET이 카테고리 이름 수정', async () => {
      const response = await request(server)
        .put(`/categories/${paramId}/name`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${jwt.cadet}`);
      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    test('[실패] PUT - NOVICE가 카테고리 이름 수정', async () => {
      const response = await request(server)
        .put(`/categories/${paramId}/name`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${jwt.novice}`);
      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    test('[실패] PUT - unauthorized', async () => {
      const response = await request(server).put(`/categories/${paramId}/name`);

      expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('/categories/{id}', () => {
    beforeEach(async () => {
      users = await dummy.createDummyUsers(userRepository);
      categories = await dummy.createDummyCategories(categoryRepository);
      paramId = 1;
      jwt = {
        admin: dummy.jwt(users.admin[0], authService),
        cadet: dummy.jwt(users.cadet[0], authService),
        novice: dummy.jwt(users.novice[0], authService),
      };
    });

    afterEach(async () => {
      delete jwt.admin;
      delete jwt.cadet;
      delete jwt.novice;
    });

    test('[성공] DELETE - ADMIN이 카테고리 삭제', async () => {
      const response = await request(server)
        .delete(`/categories/${paramId}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${jwt.admin}`);
      expect(response.status).toEqual(HttpStatus.OK);
    });

    test('[실패] DELETE - CADET이 카테고리 삭제', async () => {
      const response = await request(server)
        .delete(`/categories/${paramId}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${jwt.cadet}`);
      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    test('[실패] DELETE - NOVICE가 카테고리 삭제', async () => {
      const response = await request(server)
        .delete(`/categories/${paramId}`)
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${jwt.novice}`);
      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    test('[실패] DELETE - unauthorized', async () => {
      const response = await request(server).delete(`/categories/${paramId}`);

      expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });
  });
});
