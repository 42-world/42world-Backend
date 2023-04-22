import { ArticleModule } from '@api/article/article.module';
import { CommentModule } from '@api/comment/comment.module';
import { NotificationModule } from '@api/notification/notification.module';
import { ReactionModule } from '@api/reaction/reaction.module';
import { UserModule } from '@api/user/user.module';
import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserApiController } from './user-api.controller';

@Module({
  imports: [UserModule, NotificationModule, ArticleModule, CommentModule, ReactionModule],
  controllers: [UserApiController],
  providers: [UserService],
})
export class UserApiModule {}
