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
    @Body() { event, challenge }: IncomingSlackEvent<MessageEvent>,
  ): string | void {
    if (challenge) {
      return challenge;
    }
    logger.info(event.text);
  }
}
