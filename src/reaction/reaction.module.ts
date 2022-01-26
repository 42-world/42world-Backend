import { Module } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { ReactionController } from './reaction.controller';

@Module({
  controllers: [ReactionController],
  providers: [ReactionService],
})
export class ReactionModule {}
