import { NestFactory } from '@nestjs/core';
import { BatchModule } from './batch.module';
import { FtCheckinService } from './ft-checkin/ft-checkin.service';

async function bootstrap() {
  const app = await NestFactory.create(BatchModule);
  app.useGlobalFilters(); // TODO: 필터 적용할것

  const ftcheckinService = app.get(FtCheckinService);

  ftcheckinService.getMax();
  ftcheckinService.getNow();

  await app.listen(3000);
}
bootstrap();
