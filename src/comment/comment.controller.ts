import { Controller, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentService.create(createCommentDto);
  }

  @Put(':id')
  updateContent(
    @Param('id') id: number,
    @Body('content') content: string,
  ): Promise<Comment> {
    return this.commentService.updateContent(id, content);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.commentService.remove(id);
  }
}
