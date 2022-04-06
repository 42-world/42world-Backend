import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnection, Repository } from 'typeorm';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
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
import { User } from '@user/entities/user.entity';

describe('IntraAuth', () => {
  let httpServer: INestApplication;
  let userRepository: UserRepository;
  let intraAuthRepository: Repository<IntraAuth>;
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
    intraAuthRepository = moduleFixture.get(getRepositoryToken(IntraAuth));
    authService = moduleFixture.get(AuthService);

    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    await getConnection().close();
    await httpServer.close();
  });

  describe('/intra-auth', () => {
    let newUser: User;
    const intraId = 'rockpell';

    beforeEach(async () => {
      newUser = dummy.user(
        'user githubUid',
        'user',
        'user githubUsername',
        UserRole.NOVICE,
      );
      await userRepository.save(newUser);

      const cadetUser = dummy.user(
        'user2 githubUid',
        'user2',
        'user2 githubUsername',
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
        .send({ intraId });

      expect(response.status).toEqual(HttpStatus.OK);
    });

    test('[실패] POST - user role이 NOVICE가 아닌 경우', async () => {
      const response = await request(httpServer)
        .post('/intra-auth')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${cadetJWT}`)
        .send({ intraId });

      expect(response.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);

      // 현재는 구글 계정 에러랑 구분할 방법이 없어서 500에러로 처리
      // expect(response.status).toEqual(HttpStatus.FORBIDDEN);
      // expect(response.body.message).toEqual(FORBIDDEN_USER_ROLE);
    });

    test('[성공] GET - 이메일 인증', async () => {
      const mailCode = 'code';

      when(cacheService.getIntraAuthMailData(mailCode)).thenResolve(
        new IntraAuthMailDto(newUser.id, intraId),
      );

      const response = await request(httpServer)
        .get('/intra-auth')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`)
        .query({ code: mailCode });

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

    test('[실패] GET - 이미 가입된 카뎃', async () => {
      const mailCode = 'code';
      const cadetUser = dummy.user(
        'cadet githubUid',
        'cadet nickname',
        'cadet githubUsername',
        UserRole.CADET,
      );
      await userRepository.save(cadetUser);

      await intraAuthRepository.save(
        new IntraAuthMailDto(cadetUser.id, intraId),
      );

      when(cacheService.getIntraAuthMailData(mailCode)).thenResolve(
        new IntraAuthMailDto(cadetUser.id, intraId),
      );

      const response = await request(httpServer)
        .get('/intra-auth')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`)
        .query({ code: mailCode });

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
        .replace('<%= locals.title %>', 'Oops! There is an error ...')
        .replace('<%= locals.message %>', '인증에 실패했습니다 😭')
        .replace('<%= locals.button %>', 'Retry')
        .replace('<%= locals.endpoint %>', process.env.FRONT_URL);

      expect(response.status).toEqual(HttpStatus.OK);
      expect(response.text).toEqual(expectedEjs);
    });
  });
});
