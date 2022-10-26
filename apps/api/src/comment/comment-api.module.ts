import { ArticleModule } from '@api/article/article.module';
import { CategoryModule } from '@api/category/category.module';
import { CommentApiController } from '@api/comment/comment-api.controller';
import { CommentModule } from '@api/comment/comment.module';
import { CreateCommentApiService } from '@api/comment/services/create-comment-api.service';
import { RemoveCommentApiService } from '@api/comment/services/remove-comment-api.service';
import { UpdateCommentApiService } from '@api/comment/services/update-comment-api.service';
import { NotificationModule } from '@api/notification/notification.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [CommentModule, ArticleModule, CategoryModule, NotificationModule],
  providers: [CreateCommentApiService, UpdateCommentApiService, RemoveCommentApiService],
  controllers: [CommentApiController],
})
export class CommentApiModule {}
