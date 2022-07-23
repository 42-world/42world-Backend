import { ArticleService } from '@api/article/article.service';
import { CategoryService } from '@api/category/category.service';
import { CommentService } from '@api/comment/comment.service';
import { PaginationRequestDto } from '@api/pagination/dto/pagination-request.dto';
import { Article } from '@app/entity/article/article.entity';
import { Comment } from '@app/entity/comment/comment.entity';
import { ReactionArticle, ReactionArticleType } from '@app/entity/reaction/reaction-article.entity';
import { ReactionComment, ReactionCommentType } from '@app/entity/reaction/reaction-comment.entity';
import { User } from '@app/entity/user/user.entity';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

    private readonly categoryService: CategoryService,
  ) {}

  async articleCreateOrDelete(
    user: User,
    articleId: number,
    type: ReactionArticleType = ReactionArticleType.LIKE,
  ): Promise<
    | {
        article: Article;
        isLike: boolean;
      }
    | never
  > {
    const userId: number = user.id;
    let article = await this.articleService.findOneByIdOrFail(articleId);
    const category = await this.categoryService.findOneOrFail(article.categoryId);
    this.categoryService.checkAvailable('reactionable', category, user);

    const isReaction = await this.reactionArticleRepository.isExist(userId, articleId, type);
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
    user: User,
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
    const userId: number = user.id;
    let comment = await this.commentService.findOneByIdOrFail(commentId);
    const article = await this.articleService.findOneByIdOrFail(articleId);
    const category = await this.categoryService.findOneOrFail(article.categoryId);
    this.categoryService.checkAvailable('reactionable', category, user);

    const isReaction = await this.reactionCommentRepository.findOne({
      userId,
      commentId,
      type,
    });
    let isLike: boolean;

    if (isReaction) {
      await this.reactionCommentRepository.delete({
        userId,
        articleId,
        commentId,
        type,
      });
      comment = await this.commentService.decreaseLikeCount(comment);
      isLike = false;
    } else {
      await this.reactionCommentRepository.save({
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

  async isMyReactionArticle(
    userId: number,
    articleId: number,
    type: ReactionArticleType = ReactionArticleType.LIKE,
  ): Promise<boolean> {
    return this.reactionArticleRepository.isExist(userId, articleId, type);
  }

  async findAllMyReactionComment(
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

  async findAllArticleByUserId(
    userId: number,
    options: PaginationRequestDto,
  ): Promise<{
    likeArticles: ReactionArticle[];
    totalCount: number;
  }> {
    return this.reactionArticleRepository.findAllArticleByUserId(userId, options);
  }
}
