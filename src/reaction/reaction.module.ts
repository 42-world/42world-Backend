import { Module } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { ReactionController } from './reaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReactionArticle } from './entities/reaction-article.entity';
import { ReactionComment } from './entities/reaction-comment.entity';
import { ArticleModule } from '@root/article/article.module';
import { CommentModule } from '@root/comment/comment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReactionArticle, ReactionComment]),
    ArticleModule,
    CommentModule,
  ],
  controllers: [ReactionController],
  providers: [ReactionService],
})
export class ReactionModule {}
