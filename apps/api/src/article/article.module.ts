import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleService } from './article.service';
import { ArticleRepository } from './repositories/article.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleRepository])],
  providers: [ArticleService],
  exports: [ArticleService, TypeOrmModule],
})
export class ArticleModule {}
