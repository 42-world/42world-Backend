import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { ArticleRepository } from './repositories/article.repository';
import { CommentModule } from '@root/comment/comment.module';

@Module({
  imports: [
    forwardRef(() => CommentModule),
    TypeOrmModule.forFeature([ArticleRepository]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
