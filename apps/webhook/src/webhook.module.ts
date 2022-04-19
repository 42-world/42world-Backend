import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { SlackModule } from './slack/slack.module';

@Module({
  imports: [SlackModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
