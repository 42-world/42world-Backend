import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EntityNotFoundExceptionFilter } from './filters/entity-not-found-exception.filter';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ACCESS_TOKEN } from './auth/constants/access-token';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  const config = new DocumentBuilder()
    .setTitle('42World API')
    .setDescription('42World API')
    .setVersion('0.1')
    .addCookieAuth(ACCESS_TOKEN)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalFilters(new EntityNotFoundExceptionFilter());
  app.use(cookieParser());
  await app.listen(port || 3000);
}
bootstrap();
