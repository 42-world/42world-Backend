import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleService } from '@api/article/article.service';
import { Article } from '@api/article/entities/article.entity';
import { CommentService } from '@api/comment/comment.service';
import { Comment } from '@api/comment/entities/comment.entity';
import { PaginationRequestDto } from '@api/pagination/dto/pagination-request.dto';
import { Repository } from 'typeorm';
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
  ): Promise<
    | {
        article: Article;
        isLike: boolean;
      }
    | never
  > {
    const isReaction = await this.reactionArticleRepository.isExist(
      userId,
      articleId,
      type,
    );
    let article = await this.articleService.findOneByIdOrFail(articleId);
    let isLike: boolean;

    if (isReaction) {
      await this.reactionArticleRepository.delete({ userId, articleId, type });
      article = await this.articleService.decreaseLikeCount(article);
      isLike = false;
    } else {
      await this.reactionArticleRepository.save({ userId, articleId, type });
      article = await this.articleService.increaseLikeCount(article);
      isLike = true;
    }
    return { article, isLike };
  }

  async commentCreateOrDelete(
    userId: number,
    articleId: number,
    commentId: number,
    type: ReactionCommentType = ReactionCommentType.LIKE,
  ): Promise<
    | {
        comment: Comment;
        isLike: boolean;
      }
    | never
  > {
    const isReaction = await this.reactionCommentRepository.findOne({
      userId,
      commentId,
      type,
    });
    let comment = await this.commentService.findOneByIdOrFail(commentId);
    let isLike: boolean;

    if (isReaction) {
      this.reactionCommentRepository.delete({
        userId,
        articleId,
        commentId,
        type,
      });
      comment = await this.commentService.decreaseLikeCount(comment);
      isLike = false;
    } else {
      this.reactionCommentRepository.save({
        userId,
        articleId,
        commentId,
        type,
      });
      comment = await this.commentService.increaseLikeCount(comment);
      isLike = true;
    }
    return { comment, isLike };
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

  findAllArticleByUserId(
    userId: number,
    options: PaginationRequestDto,
  ): Promise<{
    likeArticles: ReactionArticle[];
    totalCount: number;
  }> {
    return this.reactionArticleRepository.findAllArticleByUserId(
      userId,
      options,
    );
  }
}
