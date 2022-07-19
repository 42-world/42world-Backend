import { AppModule } from '@api/app.module';
import { HttpExceptionFilter } from '@app/common/filters/http-exception.filter';
import { SentryInterceptor } from '@app/common/interceptor/sentry.interceptor';
import { stream } from '@app/utils/logger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  Sentry.init({
    dsn: configService.get('SENTRY_KEY'),
  });
  app.useGlobalInterceptors(new SentryInterceptor());
  morgan.token('body', (req) => JSON.stringify(req.body));
  app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body', { stream: stream }));

  const config = new DocumentBuilder()
    .setTitle('42World API')
    .setDescription(`42World API - ${configService.get('NODE_ENV')} environment`)
    .setVersion('0.1')
    .addCookieAuth(process.env.ACCESS_TOKEN_KEY)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: '42world',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const originList = process.env.ORIGIN_LIST || '';
  const originRegex = process.env.ORIGIN_REGEX ? new RegExp(process.env.ORIGIN_REGEX) : '';
  app.enableCors({
    origin: [...originList.split(',').map((item) => item.trim()), originRegex],
    credentials: true,
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // decorator(@)가 없는 속성이 들어오면 해당 속성은 제거하고 받아들입니다.
      forbidNonWhitelisted: true, // DTO에 정의되지 않은 값이 넘어오면 request 자체를 막습니다.
      transform: true,
    }),
  );
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  app.use(cookieParser());
  await app.listen(port || 3000);
}
bootstrap();
