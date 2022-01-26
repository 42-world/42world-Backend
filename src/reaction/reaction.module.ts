import { Module } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { ReactionController } from './reaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReactionArticle } from './entities/reaction-article.entity';
import { ReactionComment } from './entities/reaction-comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReactionArticle, ReactionComment])],
  controllers: [ReactionController],
  providers: [ReactionService],
})
export class ReactionModule {}
