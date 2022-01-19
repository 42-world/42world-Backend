import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GetUser } from '@root/auth/auth.decorator';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(
    @GetUser('id') writer_id: number,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    return this.commentService.create(writer_id, createCommentDto);
  }

  @Put(':id')
  updateContent(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') writer_id: number,
    @Body('content') content: string,
  ): Promise<Comment> {
    return this.commentService.updateContent(id, writer_id, content);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') writer_id: number,
  ): Promise<void> {
    return this.commentService.remove(id, writer_id);
  }
}
