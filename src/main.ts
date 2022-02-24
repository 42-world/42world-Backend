import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as morgan from 'morgan';
import { join } from 'path';

import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TypeormExceptionFilter } from '@root/filters/typeorm-exception.filter';
import { InternalServerErrorExceptionFilter } from '@root/filters/internal-server-error-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  morgan.token('body', (req) => JSON.stringify(req.body));
  app.use(
    morgan(
      ':method :url :status :response-time ms - :res[content-length] :body',
    ),
  );

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const config = new DocumentBuilder()
    .setTitle('42World API')
    .setDescription('42World API')
    .setVersion('0.1')
    .addCookieAuth(process.env.ACCESS_TOKEN_KEY)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors({
    origin: ['http://localhost:3000', 'https://www.42world.kr'],
    credentials: true,
  });
  app.useGlobalFilters(new TypeormExceptionFilter());
  app.useGlobalFilters(new InternalServerErrorExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // decorator(@)가 없는 속성이 들어오면 해당 속성은 제거하고 받아들입니다.
      forbidNonWhitelisted: true, // DTO에 정의되지 않은 값이 넘어오면 request 자체를 막습니다.
      transform: true,
    }),
  );
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views/intra-auth'));
  app.setViewEngine('ejs');
  app.use(cookieParser());
  await app.listen(port || 3000);
}
bootstrap();
