import { Slack } from '@app/entity/slack/slack.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlackHandlerModule } from 'nestjs-slack-listener';
import { SlackController } from './slack.controller';
import { SlackService } from './slack.service';

@Module({
  imports: [SlackHandlerModule.forRoot({}), TypeOrmModule.forFeature([Slack])],
  controllers: [SlackController],
  providers: [SlackService],
})
export class SlackModule {}
