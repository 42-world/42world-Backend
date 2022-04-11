import { Article } from '@app/entity/article/article.entity';
import { Category } from '@app/entity/category/category.entity';
import { User } from '@app/entity/user/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleSeederService } from './article-seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Article, User, Category])],
  providers: [ArticleSeederService],
  exports: [ArticleSeederService],
})
export class ArticleSeederModule {}
