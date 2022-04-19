import { Public } from '@api/auth/auth.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import { IncomingSlackEvent, MessageEvent } from 'nestjs-slack-listener';
import { SlackService } from './slack.service';

@Controller('slack')
export class SlackController {
  constructor(private readonly slackService: SlackService) {}

  @Post()
  @Public()
  event(
    @Body() { event, challenge }: IncomingSlackEvent<MessageEvent>,
  ): string | void {
    if (challenge) {
      return challenge;
    }
    this.slackService.handleMessageEvent(event);
  }
}
