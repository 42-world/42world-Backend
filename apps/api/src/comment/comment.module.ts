import { ArticleModule } from '@api/article/article.module';
import { CategoryModule } from '@api/category/category.module';
import { CommentRepository } from '@api/comment/repositories/comment.repository';
import { NotificationModule } from '@api/notification/notification.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [
    CategoryModule,
    NotificationModule,
    forwardRef(() => ArticleModule),
    TypeOrmModule.forFeature([CommentRepository]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
