import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './repositories/user.repository';
import { NotificationModule } from '@api/notification/notification.module';
import { ArticleModule } from '@api/article/article.module';
import { CommentModule } from '@api/comment/comment.module';
import { ReactionModule } from '@api/reaction/reaction.module';

@Module({
  imports: [
    NotificationModule,
    ArticleModule,
    CommentModule,
    ReactionModule,
    TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
