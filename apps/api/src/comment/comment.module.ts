import { CommentRepository } from '@api/comment/repositories/comment.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentService } from './comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([CommentRepository])],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
