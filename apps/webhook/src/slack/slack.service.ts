import { Injectable } from '@nestjs/common';
import { IncomingSlackEvent, MessageEvent } from 'nestjs-slack-listener';
import { ArticleRepository } from './repositories/article.repository';
import { SlackRepository } from './repositories/slack.repository';
import { parseMessage } from './slack.utils';

const CATEGORY_NOTICE_ID = 3;

@Injectable()
export class SlackService {
  constructor(
    private readonly slackRepository: SlackRepository,
    private readonly articleRepository: ArticleRepository,
  ) {}

  validateEvent({
    token,
    team_id,
    api_app_id,
  }: IncomingSlackEvent<MessageEvent>): boolean {
    return (
      token === process.env.SLACK_TOKEN &&
      team_id === process.env.SLACK_TEAM_ID &&
      api_app_id === process.env.SLACK_API_APP_ID
    );
  }

  async createMessage(event: MessageEvent): Promise<void> {
    const slack = await this.slackRepository.findOne({
      clientMsgId: (event as any).client_msg_id,
    });

    if (slack) return;

    const newSlack = await this.slackRepository.save({
      clientMsgId: (event as any).client_msg_id,
      text: event.text,
      user: event.user,
      channel: event.channel,
      ts: event.ts,
    });

    const categoryId = CATEGORY_NOTICE_ID;
    const writerId = parseInt(process.env.SLACK_WRITER_ID);

    await this.articleRepository.save({
      ...parseMessage(event.text, event.ts, event.channel),
      categoryId,
      writerId,
      slackId: newSlack.id,
    });
  }

  async updateMessage(event: MessageEvent): Promise<void> {
    const slack = await this.slackRepository.findOne({
      clientMsgId: (event as any).message.client_msg_id,
    });

    if (!slack) return;

    const article = await this.articleRepository.findOne({
      slackId: slack.id,
    });

    await this.slackRepository.save({
      ...slack,
      text: event.text,
    });

    await this.articleRepository.save({
      ...article,
      ...parseMessage(event.text, event.ts, event.channel),
    });
  }

  async handleMessageEvent(event: MessageEvent): Promise<void> {
    if (event.type !== 'message') return;
    if (event.channel !== process.env.SLACK_NOTICE_CHANNEL) return;

    if (event.subtype === 'message_changed') {
      await this.updateMessage(event);
    } else {
      await this.createMessage(event);
    }
  }
}
