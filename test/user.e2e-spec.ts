import { ormconfig } from './../src/database/ormconfig';
import { getEnvPath } from './../src/utils';
import { DatabaseModule } from './../src/database/database.module';
import { UserModule } from './../src/user/user.module';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: getEnvPath(),
          isGlobal: true,
          cache: true,
          load: [ormconfig],
        }),
        DatabaseModule.register(),
        UserModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users/ (GET)', (done) => {
    const appInstance = app.getHttpServer();
    request(appInstance).get('/users').expect(401).end(done);
  });
});
