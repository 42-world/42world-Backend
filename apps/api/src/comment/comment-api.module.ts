import { CommentApiController } from '@api/comment/comment-api.controller';
import { CommentModule } from '@api/comment/comment.module';
import { Module } from '@nestjs/common';
import {CreateCommentApiService} from "@api/comment/create-comment-api.service";
import {CategoryModule} from "@api/category/category.module";
import {NotificationModule} from "@api/notification/notification.module";
import {ArticleModule} from "@api/article/article.module";

@Module({
  imports: [CommentModule, ArticleModule, CategoryModule, NotificationModule],
  providers: [CreateCommentApiService],
  controllers: [CommentApiController],
})
export class CommentApiModule {}
