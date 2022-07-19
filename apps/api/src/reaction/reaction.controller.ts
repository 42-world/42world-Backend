import { Auth, AuthUser } from '@api/auth/auth.decorator';
import { Article } from '@app/entity/article/article.entity';
import { Comment } from '@app/entity/comment/comment.entity';
import { User } from '@app/entity/user/user.entity';
import { Controller, HttpCode, Param, ParseIntPipe, Post } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ReactionResponseDto } from './dto/response/reaction-response.dto';
import { ReactionService } from './reaction.service';

@ApiCookieAuth()
@ApiUnauthorizedResponse({ description: '인증 실패' })
@ApiTags('Reaction')
@Controller('reactions')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @Post('articles/:id')
  @Auth()
  @HttpCode(200)
  @ApiOperation({ summary: '게시글 좋아요 버튼' })
  @ApiCreatedResponse({
    description: '게시글 좋아요 버튼 누름',
    type: ReactionResponseDto,
  })
  @ApiNotFoundResponse({ description: '존재하지 않는 게시글' })
  async reactionArticleCreateOrDelete(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) articleId: number,
  ): Promise<ReactionResponseDto | never> {
    const { article, isLike } = await this.reactionService.articleCreateOrDelete(user, articleId);

    return ReactionResponseDto.of<Article>({ entity: article, isLike });
  }

  @Post('articles/:articleId/comments/:commentId')
  @Auth()
  @HttpCode(200)
  @ApiOperation({ summary: '댓글 좋아요 버튼' })
  @ApiCreatedResponse({
    description: '댓글 좋아요 버튼 누름',
    type: ReactionResponseDto,
  })
  @ApiNotFoundResponse({ description: '존재하지 않는 댓글' })
  async reactionCommentCreateOrDelete(
    @AuthUser() user: User,
    @Param('articleId', ParseIntPipe) articleId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ): Promise<ReactionResponseDto | never> {
    const { comment, isLike } = await this.reactionService.commentCreateOrDelete(user, articleId, commentId);

    return ReactionResponseDto.of<Comment>({ entity: comment, isLike });
  }
}
