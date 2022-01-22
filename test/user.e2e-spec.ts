import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { getConnection } from 'typeorm';
import * as cookieParser from 'cookie-parser';
import { APP_GUARD } from '@nestjs/core';

import { JwtAuthGuard } from './../src/auth/jwt-auth.guard';
import { AuthModule } from './../src/auth/auth.module';
import { ormconfig } from './../src/database/ormconfig';
import { getEnvPath } from './../src/utils';
import { DatabaseModule } from './../src/database/database.module';
import { UserModule } from './../src/user/user.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        ConfigModule.forRoot({
          envFilePath: getEnvPath(),
          isGlobal: true,
          cache: true,
          load: [ormconfig],
        }),
        DatabaseModule.register(),
        UserModule,
      ],
      providers: [
        {
          provide: APP_GUARD,
          useClass: JwtAuthGuard,
        },
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();
  });

  it('/users/ (GET)', async () => {
    const appInstance = app.getHttpServer();
    const response = await request(appInstance).get('/users');
    expect(response.status).toEqual(401);
    return;
  });

  it('/users/:id (GET)', async () => {
    const appInstance = app.getHttpServer();
    const response = await request(appInstance).get('/users/1');
    expect(response.status).toEqual(401);
    return;
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    await app.close();
  });
});
