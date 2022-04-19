import { stream } from '@app/utils/logger';
import { NestFactory } from '@nestjs/core';
import * as morgan from 'morgan';
import { WebhookModule } from './webhook.module';

async function bootstrap() {
  const app = await NestFactory.create(WebhookModule);

  morgan.token('body', (req) => JSON.stringify(req.body));
  app.use(
    morgan(
      ':method :url :status :response-time ms - :res[content-length] :body',
      { stream: stream },
    ),
  );

  await app.listen(3000);
}
bootstrap();
