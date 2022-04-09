import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { ArticleModule } from '@api/article/article.module';
import { NotificationModule } from '@api/notification/notification.module';
import { CommentRepository } from '@api/comment/repositories/comment.repository';

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
