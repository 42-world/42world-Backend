import { HttpExceptionFilter } from '@app/common/filters/http-exception.filter';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TestingModule } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import { getConnection } from 'typeorm';

export const clearDB = async () => {
  const entities = getConnection().entityMetadatas;
  for (const entity of entities) {
    const repository = getConnection().getRepository(entity.name);
    await repository.query(`TRUNCATE TABLE ${entity.tableName}`);
  }
};

export const createTestApp = (moduleFixture: TestingModule): INestApplication => {
  const app = moduleFixture.createNestApplication();

  const configService = app.get(ConfigService);

  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter(configService));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  (app as any).set('views', './apps/api/views');
  return app;
};
