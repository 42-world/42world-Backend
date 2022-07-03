import { HttpExceptionFilter } from '@app/common/filters/http-exception.filter';
import { INestApplication, ValidationPipe } from '@nestjs/common';
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

  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter());
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
