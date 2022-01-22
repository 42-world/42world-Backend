import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { ArticleRepository } from './repositories/article.repository';
import { CommentModule } from '@root/comment/comment.module';
import { CategoryModule } from '@root/category/category.module';

@Module({
  imports: [
    CategoryModule,
    forwardRef(() => CommentModule),
    TypeOrmModule.forFeature([ArticleRepository]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
