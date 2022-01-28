import { Controller, Post, Param, ParseIntPipe } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetUser } from '@root/auth/auth.decorator';
import { ReactionService } from './reaction.service';

@ApiCookieAuth()
@ApiUnauthorizedResponse({ description: '인증 실패' })
@ApiTags('Reaction')
@Controller('reactions')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @Post('articles/:id')
  @ApiOperation({ summary: '게시글 좋아요 버튼' })
  @ApiOkResponse({ description: '게시글 좋아요 버튼 누름' })
  async reactionArticleCreateOrDelete(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) articleId: number,
  ): Promise<void> {
    return this.reactionService.articleCreateOrDelete(userId, articleId);
  }

  @Post('articles/:articleId/comments/:commentId')
  @ApiOperation({ summary: '댓글 좋아요 버튼' })
  @ApiOkResponse({ description: '댓글 좋아요 버튼 누름' })
  async reactionCommentCreateOrDelete(
    @GetUser('id') userId: number,
    @Param('articleId', ParseIntPipe) articleId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ): Promise<void> {
    return this.reactionService.commentCreateOrDelete(
      userId,
      articleId,
      commentId,
    );
  }
}
