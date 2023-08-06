import { CommentRepository } from '@api/comment/repositories/comment.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentService } from './services/comment.service';

@Module({
  imports: [],
  providers: [CommentService, CommentRepository],
  exports: [CommentService],
})
export class CommentModule {}
