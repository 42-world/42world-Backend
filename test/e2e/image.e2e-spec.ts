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

describe('Image', () => {
  let app: INestApplication;
  let userRepository: UserRepository;
  let authService: AuthService;
  let JWT;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestBaseModule, UserModule, AuthModule, ImageModule],
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

  describe('/image', () => {
    beforeEach(async () => {
      const newUser = dummy.user('test1234', 'first user', UserRole.CADET);
      await userRepository.save(newUser);

      JWT = dummy.jwt(newUser.id, newUser.role, authService);
    });

    afterEach(async () => {
      await clearDB();
    });

    test('[성공] POST', async () => {
      const response = await request(app)
        .post('/image')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      const result = response.body as UploadImageUrlResponseDto;

      expect(response.status).toEqual(201);
      expect(result.uploadUrl).toBeTruthy();
    });

    test('[실패] POST - unauthorized', async () => {
      const response = await request(app).post('/image');

      expect(response.status).toEqual(401);
    });
  });
});
