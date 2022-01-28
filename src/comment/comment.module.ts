import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { ArticleModule } from '@root/article/article.module';
import { NotificationModule } from '@root/notification/notification.module';
import { CommentRepository } from '@comment/repositories/comment.repository';

@Module({
  imports: [
    NotificationModule,
    forwardRef(() => ArticleModule),
    TypeOrmModule.forFeature([CommentRepository]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
