import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Comment } from './entities/comment.entity';
import { ArticleModule } from '@root/article/article.module';
import { NotificationModule } from '@root/notification/notification.module';

@Module({
  imports: [
    NotificationModule,
    forwardRef(() => ArticleModule),
    TypeOrmModule.forFeature([Comment]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
