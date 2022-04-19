import { Injectable } from '@nestjs/common';

@Injectable()
export class WebhookService {
  getHello(): string {
    return 'Hello World!';
  }
}
