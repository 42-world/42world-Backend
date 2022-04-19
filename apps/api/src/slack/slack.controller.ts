import { Public } from '@api/auth/auth.decorator';
import { logger } from '@app/utils/logger';
import { Body, Controller, Post } from '@nestjs/common';
import {
  IncomingSlackEvent,
  MessageEvent,
  SlackEventHandler,
  SlackEventListener,
} from 'nestjs-slack-listener';
import { SlackService } from './slack.service';

const FTWORLD_RANDOM = 'C03159JLAV7';

@Controller('slack')
@SlackEventListener(({ event }) => event.channel === FTWORLD_RANDOM)
export class SlackController {
  constructor(private readonly slackService: SlackService) {}

  @Post()
  @Public()
  @SlackEventHandler({
    eventType: 'message',
  })
  event(
    @Body() { event: { text } }: IncomingSlackEvent<MessageEvent>,
    @Body('challenge') challenge?: string,
  ): string | void {
    if (challenge) {
      logger.info('Received challenge: %s', challenge);
      return challenge;
    }
    logger.info(text);
  }
}
