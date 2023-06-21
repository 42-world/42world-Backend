import { ArticleModule } from '@api/article/article.module';
import { CategoryModule } from '@api/category/category.module';
import { CommentModule } from '@api/comment/comment.module';
import { ReactionComment } from '@app/entity/reaction/reaction-comment.entity';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReactionController } from './reaction.controller';
import { ReactionService } from './reaction.service';
import { ReactionArticleRepository } from './repositories/reaction-article.repository';

@Module({
  imports: [
    CategoryModule,
    TypeOrmModule.forFeature([ReactionComment]),
    forwardRef(() => ArticleModule),
    forwardRef(() => CommentModule),
  ],
  controllers: [ReactionController],
  providers: [ReactionService, ReactionArticleRepository],
  exports: [ReactionService, ReactionArticleRepository],
})
export class ReactionModule {}
