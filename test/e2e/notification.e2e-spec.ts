import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '@root/auth/auth.module';
import { AuthService } from '@root/auth/auth.service';
import { TypeormExceptionFilter } from '@root/filters/typeorm-exception.filter';
import { NotificationModule } from '@root/notification/notification.module';
import { UserRole } from '@root/user/interfaces/userrole.interface';
import { UserRepository } from '@root/user/repositories/user.repository';
import { UserModule } from '@root/user/user.module';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { TestBaseModule } from './test.base.module';
import * as dummy from './utils/dummy';
import { clearDB } from './utils/utils';

describe('Notification', () => {
  let app: INestApplication;
  let userRepository: UserRepository;
  let authService: AuthService;
  let JWT: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestBaseModule, UserModule, AuthModule, NotificationModule],
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

  describe('/notifications', () => {
    beforeEach(async () => {
      const dummyUser = dummy.user(
        'test1234',
        'first user',
        'githubUsername',
        UserRole.CADET,
      );
      await userRepository.save(dummyUser);
      JWT = dummy.jwt(dummyUser.id, dummyUser.role, authService);
    });

    test('[성공] GET - 알람 가져오기', async () => {
      const res = await request(app)
        .get('/notifications')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(res.status).toEqual(HttpStatus.OK);
    });
  });

  describe('/notifications/readall', () => {
    beforeEach(async () => {
      const dummyUser = dummy.user(
        'test1234',
        'first user',
        'githubUsername',
        UserRole.CADET,
      );
      await userRepository.save(dummyUser);
      JWT = dummy.jwt(dummyUser.id, dummyUser.role, authService);
    });

    test('[성공] PATCH - 알림 다 읽기', async () => {
      const res = await request(app)
        .patch('/notifications/readall')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(res.status).toEqual(HttpStatus.OK);
    });
  });
});
