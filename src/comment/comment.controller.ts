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
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetUser } from '@root/auth/auth.decorator';
import { User } from '@root/user/entities/user.entity';
import { CommentService } from './comment.service';
import { CreateCommentRequestDto } from './dto/request/create-comment-request.dto';
import { UpdateCommentRequestDto } from './dto/request/update-comment-request.dto';
import { CommentResponseDto } from './dto/response/comment-response.dto';

@ApiCookieAuth()
@ApiUnauthorizedResponse({ description: '인증 실패' })
@ApiTags('Comment')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiOperation({ summary: '댓글 생성' })
  @ApiCreatedResponse({ description: '생성된 댓글', type: CreateCommentRequestDto })
  @ApiNotFoundResponse({ description: '존재하지 않는 게시글' })
  async create(
    @GetUser() writer: User,
    @Body() createCommentDto: CreateCommentRequestDto,
  ): Promise<CommentResponseDto | never> {
    const comment = await this.commentService.create(
      writer.id,
      createCommentDto,
    );

    return CommentResponseDto.of({
      comment,
      writer,
      isLike: false,
      isSelf: true,
    });
  }

  @Put(':id')
  @ApiOperation({ summary: '댓글 수정' })
  @ApiOkResponse({ description: '댓글 수정 완료' })
  @ApiNotFoundResponse({ description: '존재하지 않거나, 내가 쓴게 아님' })
  updateContent(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() writer: User,
    @Body() updateCommentDto: UpdateCommentRequestDto,
  ): Promise<void | never> {
    return this.commentService.updateContent(id, writer.id, updateCommentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '댓글 삭제' })
  @ApiOkResponse({ description: '댓글 삭제 완료' })
  @ApiNotFoundResponse({ description: '존재하지 않거나, 내가 쓴게 아님' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') writerId: number,
  ): Promise<void | never> {
    return this.commentService.remove(id, writerId);
  }
}
