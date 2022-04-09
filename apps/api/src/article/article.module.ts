import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { ArticleRepository } from './repositories/article.repository';
import { CategoryModule } from '@api/category/category.module';
import { ReactionModule } from '@api/reaction/reaction.module';
import { CommentModule } from '@api/comment/comment.module';

@Module({
  imports: [
    CategoryModule,
    forwardRef(() => ReactionModule),
    forwardRef(() => CommentModule),
    TypeOrmModule.forFeature([ArticleRepository]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
