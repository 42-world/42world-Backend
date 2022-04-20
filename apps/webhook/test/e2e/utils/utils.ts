import { InternalServerErrorExceptionFilter } from '@app/common/filters/internal-server-error-exception.filter';
import { TypeormExceptionFilter } from '@app/common/filters/typeorm-exception.filter';
import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { getConnection } from 'typeorm';

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

  app.useGlobalFilters(new InternalServerErrorExceptionFilter());
  app.useGlobalFilters(new TypeormExceptionFilter());
  return app;
};
