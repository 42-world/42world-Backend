import { logger } from '@app/utils/logger';
import { Injectable } from '@nestjs/common';
import { MessageEvent } from 'nestjs-slack-listener';

const FTWORLD_RANDOM = 'C03159JLAV7';

@Injectable()
export class SlackService {
  handleMessageEvent(event: MessageEvent): void {
    if (event.type !== 'message') return;
    if (event.channel !== FTWORLD_RANDOM) return;

    logger.info(`Received message from ${event.user} in ${event.channel}`);
  }
}
