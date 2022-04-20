import { logger } from '@app/utils/logger';
import { errorHook } from '@app/utils/utils';
import { Body, Controller, Post } from '@nestjs/common';
import { IncomingSlackEvent, MessageEvent } from 'nestjs-slack-listener';
import { SlackService } from './slack.service';

@Controller('slack')
export class SlackController {
  constructor(private readonly slackService: SlackService) {}

  @Post()
  async event(
    @Body() body: IncomingSlackEvent<MessageEvent>,
  ): Promise<{ challenge: string } | boolean> {
    const { event, challenge } = body;

    if (challenge) return { challenge };
    if (!this.slackService.validateEvent(body)) return;

    try {
      await this.slackService.handleMessageEvent(event);
    } catch (e) {
      logger.error(e.message);
      errorHook('SlackMessageEventError', e.message);
    }
  }
}
