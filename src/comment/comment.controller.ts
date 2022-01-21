import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetUser } from '@root/auth/auth.decorator';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@ApiCookieAuth()
@ApiUnauthorizedResponse({ description: '인증 실패' })
@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiOperation({ summary: '댓글 생성' })
  @ApiOkResponse({ description: '생성된 댓글', type: Comment })
  create(
    @GetUser('id') writer_id: number,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    return this.commentService.create(writer_id, createCommentDto);
  }

  @Put(':id')
  @ApiOperation({ summary: '댓글 수정' })
  @ApiOkResponse({ description: '수정된 댓글', type: Comment })
  updateContent(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') writer_id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    return this.commentService.updateContent(id, writer_id, updateCommentDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') writer_id: number,
  ): Promise<void> {
    return this.commentService.remove(id, writer_id);
  }
}
