import { Public } from '@api/auth/auth.decorator';
import { logger } from '@app/utils/logger';
import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  IncomingSlackEvent,
  MessageEvent,
  SlackEventHandler,
  SlackEventListener,
} from 'nestjs-slack-listener';
import { SlackService } from './slack.service';

const SHOUT_CHANNEL = 'C02LK2VTAQ4';

@Controller('slack')
@SlackEventListener(({ event }) => event.channel === SHOUT_CHANNEL)
export class SlackController {
  constructor(private readonly slackService: SlackService) {}

  @Post()
  @Public()
  challenge(@Body('challenge') challenge: string): string {
    return challenge;
  }

  @Get()
  @Public()
  @SlackEventHandler({
    eventType: 'message',
  })
  event(@Body() { event: { text } }: IncomingSlackEvent<MessageEvent>): void {
    logger.info(text);
  }
}
