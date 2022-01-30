import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './repositories/user.repository';
import { NotificationModule } from '@root/notification/notification.module';
import { ArticleModule } from '@article/article.module';
import { CommentModule } from '@comment/comment.module';
import { ReactionModule } from '@root/reaction/reaction.module';

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
