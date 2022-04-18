import { CategoryModule } from '@api/category/category.module';
import { CommentModule } from '@api/comment/comment.module';
import { ReactionModule } from '@api/reaction/reaction.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { ArticleRepository } from './repositories/article.repository';

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
