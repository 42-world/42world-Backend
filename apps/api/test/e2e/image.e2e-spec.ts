import { AuthModule } from '@api/auth/auth.module';
import { AuthService } from '@api/auth/auth.service';
import { UploadImageUrlResponseDto } from '@api/image/dto/upload-image-url-response.dto';
import { ImageModule } from '@api/image/image.module';
import { UserRepository } from '@api/user/repositories/user.repository';
import { UserModule } from '@api/user/user.module';
import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TestBaseModule } from '@test/e2e/test.base.module';
import { clearDB, createTestApp } from '@test/e2e/utils/utils';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import * as dummy from './utils/dummy';

describe('Image', () => {
  let httpServer: INestApplication;
  let userRepository: UserRepository;
  let authService: AuthService;
  let JWT: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestBaseModule, UserModule, AuthModule, ImageModule],
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

  describe('/image', () => {
    beforeEach(async () => {
      const newUser = dummy.user(
        'test1234',
        'first user',
        'githubUsername',
        UserRole.CADET,
      );
      await userRepository.save(newUser);

      JWT = dummy.jwt(newUser.id, newUser.role, authService);
    });

    afterEach(async () => {
      await clearDB();
    });

    test('[성공] POST', async () => {
      const response = await request(httpServer)
        .post('/image')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);

      const result = response.body as UploadImageUrlResponseDto;

      expect(response.status).toEqual(HttpStatus.OK);
      expect(result.uploadUrl).toBeTruthy();
    });

    test('[실패] POST - unauthorized', async () => {
      const response = await request(httpServer).post('/image');

      expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });
  });
});
