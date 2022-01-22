import { SeederModule } from './../src/database/seeder/seeder.module';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import * as cookieParser from 'cookie-parser';
import { APP_GUARD } from '@nestjs/core';

import { JwtAuthGuard } from './../src/auth/jwt-auth.guard';
import { AuthModule } from './../src/auth/auth.module';
import { UserModule } from './../src/user/user.module';
import { EntityNotFoundExceptionFilter } from './../src/filters/entity-not-found-exception.filter';
import { Seeder } from '@root/database/seeder/seeder';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let JWT;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, UserModule, SeederModule],
      providers: [
        {
          provide: APP_GUARD,
          useClass: JwtAuthGuard,
        },
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.use(cookieParser());

    app.useGlobalFilters(new EntityNotFoundExceptionFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    const seeder = app.get(Seeder);

    await seeder.seed();

    app = app.getHttpServer();
    JWT = process.env.TEST_JWT;
  });

  it('/users/ (GET)', async () => {
    const response = await request(app)
      .get('/users')
      .set('Cookie', `access_token=${JWT}`);

    expect(response.status).toEqual(200);
    return;
  });

  it('/users/:id (GET)', async () => {
    const response = await request(app)
      .get('/users/1')
      .set('Cookie', `access_token=${JWT}`);

    expect(response.status).toEqual(200);
    return;
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    await app.close();
  });
});
