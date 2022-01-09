import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { ArticleSeederService } from './article-seeder.service';
import { Article } from '@article/entities/article.entity';
import { User } from '@user/entities/user.entity';
import { Category } from '@category/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, User, Category])],
  providers: [ArticleSeederService],
  exports: [ArticleSeederService],
})
export class ArticleSeederModule {}
