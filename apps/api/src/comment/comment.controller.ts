import { Auth, AuthUser } from '@api/auth/auth.decorator';
import { User } from '@app/entity/user/user.entity';
import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
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
  @Auth()
  @ApiOperation({ summary: '댓글 생성' })
  @ApiCreatedResponse({
    description: '생성된 댓글',
    type: CreateCommentRequestDto,
  })
  @ApiNotFoundResponse({ description: '존재하지 않는 게시글' })
  @ApiForbiddenResponse({ description: '댓글을 쓸수없는 게시글' })
  async create(
    @AuthUser() writer: User,
    @Body() createCommentDto: CreateCommentRequestDto,
  ): Promise<CommentResponseDto | never> {
    const comment = await this.commentService.create(writer, createCommentDto);

    return CommentResponseDto.of({
      comment,
      writer,
      isLike: false,
      isSelf: true,
      isAnonymous: false,
    });
  }

  @Put(':id')
  @Auth()
  @ApiOperation({ summary: '댓글 수정' })
  @ApiOkResponse({ description: '댓글 수정 완료' })
  @ApiNotFoundResponse({ description: '존재하지 않거나, 내가 쓴게 아님' })
  async updateContent(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() writer: User,
    @Body() updateCommentDto: UpdateCommentRequestDto,
  ): Promise<void | never> {
    return this.commentService.updateContent(id, writer.id, updateCommentDto);
  }

  @Delete(':id')
  @Auth()
  @ApiOperation({ summary: '댓글 삭제' })
  @ApiOkResponse({ description: '댓글 삭제 완료' })
  @ApiNotFoundResponse({ description: '존재하지 않거나, 내가 쓴게 아님' })
  async remove(@Param('id', ParseIntPipe) id: number, @AuthUser('id') writerId: number): Promise<void | never> {
    return this.commentService.remove(id, writerId);
  }
}
