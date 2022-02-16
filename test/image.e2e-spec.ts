import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';

import { UserRepository } from '@user/repositories/user.repository';
import { AuthService } from '@auth/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TestBaseModule } from './test.base.module';
import { UserModule } from '@user/user.module';
import { AuthModule } from '@auth/auth.module';
import { TypeormExceptionFilter } from '@root/filters/typeorm-exception.filter';
import { User, UserRole } from '@user/entities/user.entity';
import { JWTPayload } from '@auth/interfaces/jwt-payload.interface';
import { ImageModule } from '@image/image.module';
import { getConnection } from 'typeorm';
import { UploadImageUrlResponseDto } from '@image/dto/upload-image-url-response.dto';

describe('UserController (e2e)', () => {
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

  beforeEach(async () => {
    const newUser = new User();
    newUser.oauthToken = 'test1234';
    newUser.nickname = 'first user';
    newUser.role = UserRole.CADET;
    await userRepository.save(newUser);

    JWT = authService.getJWT({
      userId: newUser.id,
      userRole: newUser.role,
    } as JWTPayload);
  });

  afterEach(async () => {
    await Promise.all([userRepository.clear()]);
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    await getConnection().close();
    await app.close();
  });

  test('이미지 업로드 url 생성', async () => {
    const response = await request(app)
      .post('/image')
      .set('Cookie', `access_token=${JWT}`);

    const result = response.body as UploadImageUrlResponseDto;

    expect(response.status).toEqual(201);
    expect(result.uploadUrl).toBeTruthy();
  });
});
