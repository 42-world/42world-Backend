import { forwardRef, Module } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { ReactionController } from './reaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReactionComment } from './entities/reaction-comment.entity';
import { ArticleModule } from '@api/article/article.module';
import { CommentModule } from '@api/comment/comment.module';
import { ReactionArticleRepository } from './repositories/reaction-article.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReactionArticleRepository, ReactionComment]),
    forwardRef(() => ArticleModule),
    forwardRef(() => CommentModule),
  ],
  controllers: [ReactionController],
  providers: [ReactionService],
  exports: [ReactionService],
})
export class ReactionModule {}
