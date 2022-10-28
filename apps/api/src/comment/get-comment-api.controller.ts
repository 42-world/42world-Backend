import { Auth, AuthUser } from '@api/auth/auth.decorator';
import { CommentResponseDto } from '@api/comment/dto/response/comment-response.dto';
import { GetCommentApiService } from '@api/comment/services/get-comment-api.service';
import { PaginationRequestDto } from '@api/pagination/dto/pagination-request.dto';
import { PaginationResponseDto } from '@api/pagination/dto/pagination-response.dto';
import { ApiPaginatedResponse } from '@api/pagination/pagination.decorator';
import { User } from '@app/entity/user/user.entity';
import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiCookieAuth()
@ApiUnauthorizedResponse({ description: '인증 실패' })
@ApiTags('Comment')
@Controller('articles')
export class GetCommentApiController {
  constructor(private readonly getCommentApiService: GetCommentApiService) {}

  @Get(':id/comments')
  @Auth('public')
  @ApiOperation({ summary: '게시글 댓글 가져오기' })
  @ApiPaginatedResponse(CommentResponseDto)
  async getComments(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) articleId: number,
    @Query() options: PaginationRequestDto,
  ): Promise<PaginationResponseDto<CommentResponseDto>> {
    const { comments, category, totalCount, reactionComments } = await this.getCommentApiService.getComments(
      user,
      articleId,
      options,
    );

    return PaginationResponseDto.of({
      data: CommentResponseDto.ofArray({
        comments,
        reactionComments,
        userId: user.id,
        isAnonymous: category.anonymity,
      }),
      options,
      totalCount,
    });
  }
}
