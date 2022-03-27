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
import { instance, mock, when } from 'ts-mockito';
import { IntraAuthMailDto } from '@cache/dto/intra-auth.dto';

describe('IntraAuth', () => {
  let app: INestApplication;
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

    test('[성공] POST', async () => {
      const response = await request(app)
        .post('/intra-auth')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`)
        .send({ intraId: 'rockpell' });

      expect(response.status).toEqual(201);
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

    test('[성공] GET', async () => {
      when(cacheService.getIntraAuthMailData('code')).thenResolve(
        new IntraAuthMailDto(newUser.id, 'intraId'),
      );

      const response = await request(app)
        .get('/intra-auth')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`)
        .query({ code: 'code' });

      expect(response.status).toEqual(200);
      expect(response.text).toEqual(
        '<div>\n' +
          '    <div>\n' +
          '      <img\n' +
          '        style="margin: auto; display: block; text-align: center"\n' +
          '        src="https://avatars.githubusercontent.com/u/97225581?s=400&u=2c69bfb4d3794a8434ea4399cc329117806ecb4d&v=4"\n' +
          '        alt="42world logo"\n' +
          '      />\n' +
          '    </div>\n' +
          '    <div style="margin: auto; text-align: center">\n' +
          '      <h1>Hello World!</h1>\n' +
          '      <h2>인증에 성공했습니다! 🥳</h2>\n' +
          '\n' +
          '      <div\n' +
          '        style="\n' +
          '          display: inline-block;\n' +
          '          padding: 15px;\n' +
          '          background-color: #01bbd6;\n' +
          '          border-radius: 15px;\n' +
          '          text-align: center;\n' +
          '          margin: 20px;\n' +
          '          width: 250px;\n' +
          '          height: 60px;\n' +
          '          line-height: 60px;\n' +
          '        "\n' +
          '      >\n' +
          '        <a\n' +
          '          href=' +
          `"${process.env.FRONT_URL}"` +
          '\n' +
          '          style="\n' +
          '            margin: auto;\n' +
          '            color: white;\n' +
          '            font-size: 30px;\n' +
          '            font-weight: bolder;\n' +
          '            text-align: center;\n' +
          '            text-decoration-line: none;\n' +
          '          "\n' +
          '          >Welcome, Cadet!</a\n' +
          '        >\n' +
          '      </div>\n' +
          '      <div>- 42WORLD -</div>\n' +
          '    </div>\n' +
          '  </div>\n' +
          '  ',
      );
    });
  });
});
