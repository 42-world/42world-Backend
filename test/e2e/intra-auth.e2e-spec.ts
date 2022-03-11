import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnection } from 'typeorm';

import { UserRepository } from '@user/repositories/user.repository';
import { AuthService } from '@auth/auth.service';
import { UserModule } from '@user/user.module';
import { AuthModule } from '@auth/auth.module';
import { TypeormExceptionFilter } from '@root/filters/typeorm-exception.filter';
import { TestBaseModule } from '@test/e2e/test.base.module';
import { clearDB } from '@test/e2e/utils/utils';
import * as dummy from './utils/dummy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntraAuth } from '@intra-auth/entities/intra-auth.entity';
import { IntraAuthController } from '@intra-auth/intra-auth.controller';
import { IntraAuthService } from '@intra-auth/intra-auth.service';
import { CacheService } from '@cache/cache.service';
import { MailerService } from '@nestjs-modules/mailer';
import { InternalServerErrorExceptionFilter } from '@root/filters/internal-server-error-exception.filter';
import { UserRole } from '@user/interfaces/userrole.interface';

describe('IntraAuth', () => {
  let app: INestApplication;
  let userRepository: UserRepository;
  let authService: AuthService;
  let cacheService: CacheService;
  let JWT;
  let cadetJWT;
  const sendMailMock = jest.fn();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TestBaseModule,
        UserModule,
        AuthModule,
        TypeOrmModule.forFeature([IntraAuth]),
      ],
      providers: [
        IntraAuthService,
        {
          provide: MailerService,
          useValue: {
            sendMail: sendMailMock,
          },
        },
        {
          provide: CacheService,
          useValue: {
            setIntraAuthMailData: jest.fn(),
            getIntraAuthMailData: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
      controllers: [IntraAuthController],
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
    cacheService = moduleFixture.get<CacheService>(CacheService);

    app = app.getHttpServer();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    await getConnection().close();
    await app.close();
  });

  beforeEach(() => {
    sendMailMock.mockClear();
  });

  describe('/intra-auth', () => {
    beforeEach(async () => {
      const newUser = dummy.user(
        'test1',
        'first user',
        'githubUsername',
        UserRole.NOVICE,
      );
      await userRepository.save(newUser);

      const cadetUser = dummy.user(
        'test2',
        'first user2',
        'githubUsername2',
        UserRole.CADET,
      );
      await userRepository.save(cadetUser);

      JWT = dummy.jwt(newUser.id, newUser.role, authService);
      cadetJWT = dummy.jwt(cadetUser.id, cadetUser.role, authService);
    });

    afterEach(async () => {
      await clearDB();
    });

    test('[성공] POST', async () => {
      const response = await request(app)
        .post('/intra-auth')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`)
        .send({ intraId: 'rockpell' });

      expect(response.status).toEqual(201);
      expect(cacheService.setIntraAuthMailData).toBeCalled();
      expect(sendMailMock).toBeCalled();
    });

    test('[실패] POST - user role이 NOVICE가 아닌 경우', async () => {
      const response = await request(app)
        .post('/intra-auth')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${cadetJWT}`)
        .send({ intraId: 'rockpell' });

      expect(response.status).toEqual(500);

      // 현재는 구글 계정 에러랑 구분할 방법이 없어서 500애러로 처리
      // expect(response.status).toEqual(403);
      // expect(response.body.message).toEqual(FORBIDDEN_USER_ROLE);
    });
  });
});
