import { SentryInterceptor } from '@app/common/interceptor/sentry.interceptor';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as Sentry from '@sentry/node';
import { BatchModule } from './batch.module';
import { FtCheckinService } from './ft-checkin/ft-checkin.service';

async function bootstrap() {
  const app = await NestFactory.create(BatchModule);
  const configService = app.get(ConfigService);
  const ftcheckinService = app.get(FtCheckinService);

  Sentry.init({
    dsn: configService.get('SENTRY_KEY'),
  });
  app.useGlobalInterceptors(new SentryInterceptor());
  ftcheckinService.getMax();
  ftcheckinService.getNow();

  await app.listen(3000);
}
bootstrap();
