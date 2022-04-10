import { getConnection } from 'typeorm';
import * as cookieParser from 'cookie-parser';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';

import { InternalServerErrorExceptionFilter } from '@app/common/filters/internal-server-error-exception.filter';
import { TypeormExceptionFilter } from '@app/common/filters/typeorm-exception.filter';

export const clearDB = async () => {
  const entities = getConnection().entityMetadatas;
  for (const entity of entities) {
    const repository = getConnection().getRepository(entity.name);
    await repository.query(`TRUNCATE TABLE ${entity.tableName}`);
  }
};

export const createTestApp = (
  moduleFixture: TestingModule,
): INestApplication => {
  const app = moduleFixture.createNestApplication();

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
  (app as any).set('views', './apps/api/views');
  return app;
};
