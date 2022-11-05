import { ArticleModule } from '@api/article/article.module';
import { CategoryModule } from '@api/category/category.module';
import { ReactionModule } from '@api/reaction/reaction.module';
import { Module } from '@nestjs/common';
import { ArticleApiController } from './article-api.controller';
import { ArticleApiService } from './article-api.service';

@Module({
  imports: [ArticleModule, CategoryModule, ReactionModule],
  providers: [ArticleApiService],
  controllers: [ArticleApiController],
})
export class ArticleApiModule {}
