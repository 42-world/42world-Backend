import { Controller, Get } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller()
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Get()
  getHello(): string {
    return this.webhookService.getHello();
  }
}
