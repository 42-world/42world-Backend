import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlackHandlerModule } from 'nestjs-slack-listener';
import { ArticleRepository } from './repositories/article.repository';
import { SlackRepository } from './repositories/slack.repository';
import { SlackController } from './slack.controller';
import { SlackService } from './slack.service';

@Module({
  imports: [
    SlackHandlerModule.forRoot({}),
    TypeOrmModule.forFeature([SlackRepository, ArticleRepository]),
  ],
  controllers: [SlackController],
  providers: [SlackService],
})
export class SlackModule {}
