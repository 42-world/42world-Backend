import { forwardRef, Inject, Injectable } from '@nestjs/common';
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
import { ReactionArticleRepository } from './repositories/reaction-article.repository';

@Injectable()
export class ReactionService {
  constructor(
    private readonly reactionArticleRepository: ReactionArticleRepository,

    @InjectRepository(ReactionComment)
    private readonly reactionCommentRepository: Repository<ReactionComment>,

    @Inject(forwardRef(() => ArticleService))
    private readonly articleService: ArticleService,

    @Inject(forwardRef(() => CommentService))
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
    articleId: number,
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
      return this.reactionCommentRepository.save({
        userId,
        articleId,
        commentId,
        type,
      });
    }
  }

  isExistArticle(
    userId: number,
    articleId: number,
    type: ReactionArticleType = ReactionArticleType.LIKE,
  ): Promise<boolean> {
    return this.reactionArticleRepository.isExist(userId, articleId, type);
  }

  findAllCommentByArticleId(
    userId: number,
    articleId: number,
    type: ReactionCommentType = ReactionCommentType.LIKE,
  ): Promise<ReactionComment[]> {
    return this.reactionCommentRepository.find({
      userId,
      articleId,
      type,
    });
  }
}
