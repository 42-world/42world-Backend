import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { ArticleModule } from '@root/article/article.module';
import { NotificationModule } from '@root/notification/notification.module';
import { CommentRepository } from './repositories/comment.repository';

@Module({
  imports: [
    NotificationModule,
    ArticleModule,
    TypeOrmModule.forFeature([CommentRepository]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
