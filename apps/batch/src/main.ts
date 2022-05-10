import { SentryInterceptor } from '@app/common/interceptor/sentry.interceptor';
import { NestFactory } from '@nestjs/core';
import { BatchModule } from './batch.module';

async function bootstrap() {
  const app = await NestFactory.create(BatchModule);
  app.useGlobalInterceptors(new SentryInterceptor());
  app.useGlobalFilters(); // TODO: 필터 적용할것
  await app.listen(3000);
}
bootstrap();
