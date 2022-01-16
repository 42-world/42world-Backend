import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EntityNotFoundExceptionFilter } from './filters/entity-not-found-exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new EntityNotFoundExceptionFilter());
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
