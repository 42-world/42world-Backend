import { ArticleModule } from '@api/article/article.module';
import { CommentModule } from '@api/comment/comment.module';
import { NotificationModule } from '@api/notification/notification.module';
import { ReactionModule } from '@api/reaction/reaction.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

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
