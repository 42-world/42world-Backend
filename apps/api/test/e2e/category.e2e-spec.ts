import { AuthModule } from '@api/auth/auth.module';
import { AuthService } from '@api/auth/auth.service';
import { CategoryModule } from '@api/category/category.module';
import { CreateCategoryRequestDto } from '@api/category/dto/request/create-category-request.dto';
import { CategoryResponseDto } from '@api/category/dto/response/category-response.dto';
import { CategoryRepository } from '@api/category/repositories/category.repository';
import { UserRepository } from '@api/user/repositories/user.repository';
import { UserModule } from '@api/user/user.module';
import { Category } from '@app/entity/category/category.entity';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TestBaseModule } from '@test/e2e/test.base.module';
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
  let categories: {
    자유게시판: Category;
    익명게시판: Category;
    유머게시판: Category;
  };
  let paramId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestBaseModule, UserModule, AuthModule, CategoryModule],
    }).compile();

    const app = createTestApp(moduleFixture);
    await app.init();

    userRepository = moduleFixture.get(UserRepository);
    categoryRepository = moduleFixture.get(CategoryRepository);
    authService = moduleFixture.get(AuthService);

    server = app.getHttpServer();

    //TODO: createDummyCategories로 대체
    categories = {
      자유게시판: dummy.category('자유게시판'),
      익명게시판: dummy.category('익명게시판'),
      유머게시판: dummy.category('유머게시판'),
    };
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
      await categoryRepository.save(Object.values(categories));
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

      const categories = response.body as CategoryResponseDto[];

      expect(categories).toBeInstanceOf(Array);
      expect(categories[0].name).toBe('자유게시판');
      expect(categories[1].name).toBe('익명게시판');
      expect(categories[2].name).toBe('유머게시판');
    });

    test('[성공] GET - CADET이 카테고리 종류 가져오기', async () => {
      const response = await request(server)
        .get('/categories')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${jwt.cadet}`);
      expect(response.status).toEqual(HttpStatus.OK);

      const categories = response.body as CategoryResponseDto[];

      expect(categories).toBeInstanceOf(Array);
      expect(categories[0].name).toBe('자유게시판');
      expect(categories[1].name).toBe('익명게시판');
      expect(categories[2].name).toBe('유머게시판');
    });

    test('[성공] GET - NOVICE가 카테고리 종류 가져오기', async () => {
      const response = await request(server)
        .get('/categories')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${jwt.novice}`);
      expect(response.status).toEqual(HttpStatus.OK);

      const categories = response.body as CategoryResponseDto[];

      expect(categories).toBeInstanceOf(Array);
      expect(categories[0].name).toBe('자유게시판');
      expect(categories[1].name).toBe('익명게시판');
      expect(categories[2].name).toBe('유머게시판');
    });

    test('[실패] GET - unauthorized', async () => {
      const response = await request(server).get('/categories');

      expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('/categories/{id}/name', () => {
    beforeEach(async () => {
      users = await dummy.createDummyUsers(userRepository);
      await categoryRepository.save(Object.values(categories));
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

      const category = response.body as CategoryResponseDto;

      expect(category.id).toBe(2);
      expect(category.name).toBe('update_category');
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
      await categoryRepository.save(Object.values(categories));
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
