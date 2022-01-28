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
    private readonly commentService: CommentService,
  ) {}

  async articleCreateOrDelete(
    userId: number,
    articleId: number,
    type: ReactionArticleType = ReactionArticleType.LIKE,
  ): Promise<void> {
    const reactionArticle = await this.reactionArticleRepository.findOne({
      userId,
      articleId,
      type,
    });
    const article = await this.articleService.getOne(articleId);

    if (reactionArticle) {
      this.articleService.decreaseLikeCount(article);
      this.reactionArticleRepository.delete({ id: reactionArticle.id });
    } else {
      this.articleService.increaseLikeCount(article);
      this.reactionArticleRepository.save({ userId, articleId, type });
    }
  }

  async commentCreateOrDelete(
    userId: number,
    articleId: number,
    commentId: number,
    type: ReactionCommentType = ReactionCommentType.LIKE,
  ): Promise<void> {
    const reactionArticle = await this.reactionCommentRepository.findOne({
      userId,
      commentId,
      type,
    });
    const comment = await this.commentService.getOne(commentId);

    if (reactionArticle) {
      this.commentService.decreaseLikeCount(comment);
      this.reactionCommentRepository.delete({ id: reactionArticle.id });
    } else {
      this.commentService.increaseLikeCount(comment);
      this.reactionCommentRepository.save({
        userId,
        articleId,
        commentId,
        type,
      });
    }
  }

  isMyReactionArticle(
    userId: number,
    articleId: number,
    type: ReactionArticleType = ReactionArticleType.LIKE,
  ): Promise<boolean> {
    return this.reactionArticleRepository.isExist(userId, articleId, type);
  }

  findAllMyReactionComment(
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

  findAllArticleByUserId(userId: number): Promise<ReactionArticle[]> {
    return this.reactionArticleRepository.findAllArticleByUserId(userId);
  }
}
