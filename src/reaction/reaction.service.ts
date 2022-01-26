import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleService } from '@root/article/article.service';
import { CommentService } from '@root/comment/comment.service';
import { DeleteResult, Repository } from 'typeorm';
import {
  ReactionArticle,
  ReactionArticleType,
} from './entities/reaction-article.entity';
import {
  ReactionComment,
  ReactionCommentType,
} from './entities/reaction-comment.entity';

@Injectable()
export class ReactionService {
  constructor(
    @InjectRepository(ReactionArticle)
    private readonly reactionArticleRepository: Repository<ReactionArticle>,

    @InjectRepository(ReactionComment)
    private readonly reactionCommentRepository: Repository<ReactionComment>,

    private readonly articleService: ArticleService,

    private readonly commnetService: CommentService,
  ) {}

  async articleCreateOrDelete(
    userId: number,
    articleId: number,
    type: ReactionArticleType = ReactionArticleType.LIKE,
  ): Promise<ReactionArticle | DeleteResult> {
    const reactionArticle = await this.reactionArticleRepository.findOne({
      userId,
      articleId,
      type,
    });
    const article = await this.articleService.getOne(articleId);

    if (reactionArticle) {
      await this.articleService.decreaseLikeCount(article);
      return this.reactionArticleRepository.delete({ id: reactionArticle.id });
    } else {
      await this.articleService.increaseLikeCount(article);
      return this.reactionArticleRepository.save({ userId, articleId, type });
    }
  }

  async commentCreateOrDelete(
    userId: number,
    commentId: number,
    type: ReactionCommentType = ReactionCommentType.LIKE,
  ): Promise<ReactionComment | DeleteResult> {
    const reactionArticle = await this.reactionCommentRepository.findOne({
      userId,
      commentId,
      type,
    });
    const comment = await this.commnetService.getOne(commentId);

    if (reactionArticle) {
      await this.commnetService.decreaseLikeCount(comment);
      return this.reactionCommentRepository.delete({ id: reactionArticle.id });
    } else {
      await this.commnetService.increaseLikeCount(comment);
      return this.reactionCommentRepository.save({ userId, commentId, type });
    }
  }
}
