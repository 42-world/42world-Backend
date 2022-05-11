import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AdminModule } from './admin.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AdminModule);
  const configService = app.get(ConfigService);
  const port = configService.get('ADMIN_PORT');
  await app.listen(port);
}
bootstrap();
