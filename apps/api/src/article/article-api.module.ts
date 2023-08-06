import { ArticleModule } from '@api/article/article.module';
import {
  CreateArticleApiService,
  FindArticleApiService,
  RemoveArticleApiService,
  SearchArticleApiService,
  UpdateArticleApiService,
} from '@api/article/service';
import { CategoryModule } from '@api/category/category.module';
import { ReactionModule } from '@api/reaction/reaction.module';
import { Module } from '@nestjs/common';
import { ArticleApiController } from './article-api.controller';

@Module({
  imports: [
    ArticleModule, //
    CategoryModule,
    ReactionModule,
  ],
  providers: [
    CreateArticleApiService,
    FindArticleApiService,
    UpdateArticleApiService,
    SearchArticleApiService,
    RemoveArticleApiService,
  ],
  controllers: [ArticleApiController],
})
export class ArticleApiModule {}
