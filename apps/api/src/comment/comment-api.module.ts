import { CommentApiController } from '@api/comment/comment-api.controller';
import { CommentModule } from '@api/comment/comment.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [CommentModule],
  providers: [],
  controllers: [CommentApiController],
})
export class CommentApiModule {}
