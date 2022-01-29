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

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let userRepository: UserRepository;
  let authService: AuthService;
  let JWT;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestBaseModule, UserModule, AuthModule],
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

  it('유저 삭제하기', async () => {
    const response = await request(app)
      .delete('/users')
      .set('Cookie', `access_token=${JWT}`);

    expect(response.status).toEqual(200);

    const deletedUser = await userRepository.findOne(1, { withDeleted: true });
    expect(deletedUser.deletedAt).toBeTruthy();
  });
});
