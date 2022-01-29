import { Controller, Post, Param, ParseIntPipe } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DetailArticleDto } from '@root/article/dto/detail-article.dto';
import { Article } from '@root/article/entities/article.entity';
import { GetUser } from '@root/auth/auth.decorator';
import { LikeCommentDto } from './dto/like-article.dto';
import { ReactionService } from './reaction.service';

@ApiCookieAuth()
@ApiUnauthorizedResponse({ description: '인증 실패' })
@ApiTags('Reaction')
@Controller('reactions')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @Post('articles/:id')
  @ApiOperation({ summary: '게시글 좋아요 버튼' })
  @ApiOkResponse({ description: '게시글 좋아요 버튼 누름', type: Article })
  async reactionArticleCreateOrDelete(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) articleId: number,
  ): Promise<DetailArticleDto> {
    return this.reactionService.articleCreateOrDelete(userId, articleId);
  }

  @Post('articles/:articleId/comments/:commentId')
  @ApiOperation({ summary: '댓글 좋아요 버튼' })
  @ApiOkResponse({ description: '댓글 좋아요 버튼 누름' })
  async reactionCommentCreateOrDelete(
    @GetUser('id') userId: number,
    @Param('articleId', ParseIntPipe) articleId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ): Promise<LikeCommentDto> {
    return this.reactionService.commentCreateOrDelete(
      userId,
      articleId,
      commentId,
    );
  }
}
