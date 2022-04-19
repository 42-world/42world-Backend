import { Module } from '@nestjs/common';
import { SlackHandlerModule } from 'nestjs-slack-listener';
import { SlackController } from './slack.controller';
import { SlackService } from './slack.service';

@Module({
  imports: [SlackHandlerModule.forRoot({})],
  controllers: [SlackController],
  providers: [SlackService],
})
export class SlackModule {}
