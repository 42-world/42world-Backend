import { Controller, Post, Param, ParseIntPipe } from '@nestjs/common';
import { GetUser } from '@root/auth/auth.decorator';
import { ReactionService } from './reaction.service';

@Controller('reactions')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @Post('articles/:id')
  async reactionArticleCreateOrDelete(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) articleId: number,
  ) {
    return this.reactionService.articleCreateOrDelete(userId, articleId);
  }

  @Post('comments/:id')
  async reactionCommentCreateOrDelete(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) commentId: number,
  ) {
    return this.reactionService.commentCreateOrDelete(userId, commentId);
  }
}
