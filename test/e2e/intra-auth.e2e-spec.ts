import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnection } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { instance, mock, when } from 'ts-mockito';
import { readFileSync } from 'fs';
import { join } from 'path';

import { UserRepository } from '@user/repositories/user.repository';
import { AuthService } from '@auth/auth.service';
import { UserModule } from '@user/user.module';
import { AuthModule } from '@auth/auth.module';
import { TestBaseModule } from '@test/e2e/test.base.module';
import { clearDB, createTestApp } from '@test/e2e/utils/utils';
import * as dummy from './utils/dummy';
import { IntraAuth } from '@intra-auth/entities/intra-auth.entity';
import { IntraAuthController } from '@intra-auth/intra-auth.controller';
import { IntraAuthService } from '@intra-auth/intra-auth.service';
import { CacheService } from '@cache/cache.service';
import { MailerService } from '@nestjs-modules/mailer';
import { UserRole } from '@user/interfaces/userrole.interface';
import { IntraAuthMailDto } from '@cache/dto/intra-auth.dto';

describe('IntraAuth', () => {
  let httpServer: INestApplication;
  let userRepository: UserRepository;
  let authService: AuthService;
  const cacheService: CacheService = mock(CacheService);
  const mailerService: MailerService = mock(MailerService);

  let JWT;
  let cadetJWT;

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
            sendMail: mailerService.sendMail,
          },
        },
        {
          provide: CacheService,
          useValue: instance(cacheService),
        },
      ],
      controllers: [IntraAuthController],
    }).compile();

    const app = createTestApp(moduleFixture);
    await app.init();

    userRepository = moduleFixture.get(UserRepository);
    authService = moduleFixture.get(AuthService);

    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    await getConnection().close();
    await httpServer.close();
  });

  describe('/intra-auth', () => {
    let newUser;
    beforeEach(async () => {
      newUser = dummy.user(
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

    test('[성공] POST - 이메일 전송', async () => {
      const response = await request(httpServer)
        .post('/intra-auth')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`)
        .send({ intraId: 'rockpell' });

      expect(response.status).toEqual(HttpStatus.CREATED);
    });

    test('[실패] POST - user role이 NOVICE가 아닌 경우', async () => {
      const response = await request(httpServer)
        .post('/intra-auth')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${cadetJWT}`)
        .send({ intraId: 'rockpell' });

      expect(response.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);

      // 현재는 구글 계정 에러랑 구분할 방법이 없어서 500에러로 처리
      // expect(response.status).toEqual(HttpStatus.FORBIDDEN);
      // expect(response.body.message).toEqual(FORBIDDEN_USER_ROLE);
    });

    test('[성공] GET - 이메일 인증', async () => {
      when(cacheService.getIntraAuthMailData('code')).thenResolve(
        new IntraAuthMailDto(newUser.id, 'intraId'),
      );

      const response = await request(httpServer)
        .get('/intra-auth')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`)
        .query({ code: 'code' });

      let resultEjs: string;
      try {
        const resultEjsPath = join(
          __dirname,
          '../../views/intra-auth/results.ejs',
        );
        resultEjs = readFileSync(resultEjsPath, 'utf8');
      } catch (err) {
        console.error(err);
      }

      expect(resultEjs).toBeTruthy();
      const expectedEjs = resultEjs
        .replace('<%= locals.title %>', 'Hello World!')
        .replace('<%= locals.message %>', '인증에 성공했습니다! 🥳')
        .replace('<%= locals.button %>', 'Welcome, Cadet!')
        .replace('<%= locals.endpoint %>', process.env.FRONT_URL);

      expect(response.status).toEqual(HttpStatus.OK);
      expect(response.text).toEqual(expectedEjs);
    });
  });
});
