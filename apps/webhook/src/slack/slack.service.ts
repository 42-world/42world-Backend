import { Slack } from '@app/entity/slack/slack.entity';
import { logger } from '@app/utils/logger';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEvent } from 'nestjs-slack-listener';
import { Repository } from 'typeorm';

const FTWORLD_RANDOM = 'C03159JLAV7';

@Injectable()
export class SlackService {
  constructor(
    @InjectRepository(Slack)
    private readonly slackRepository: Repository<Slack>,
  ) {}

  handleMessageEvent(event: MessageEvent): void {
    if (event.type !== 'message') return;
    if (event.channel !== FTWORLD_RANDOM) return;

    logger.info(`Received message from ${event.user} in ${event.channel}`);
    this.slackRepository.save({
      client_msg_id: (event as any).client_msg_id, // TODO: any 타입 삭제할것
      text: event.text,
      user: event.user,
      channelId: event.channel,
      ts: event.ts,
    });
  }
}
