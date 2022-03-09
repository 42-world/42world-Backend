import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleService } from '@root/article/article.service';
import { DetailArticleDto } from '@root/article/dto/detail-article.dto';
import { CommentService } from '@root/comment/comment.service';
import { PageOptionsDto } from '@root/pagination/page-options.dto';
import { PageDto } from '@root/pagination/pagination.dto';
import { Repository } from 'typeorm';
import { LikeCommentDto } from './dto/like-article.dto';
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
  ): Promise<DetailArticleDto> {
    const reactionArticle = await this.reactionArticleRepository.findOne({
      userId,
      articleId,
      type,
    });
    const article = await this.articleService.findOneOrFailById(articleId);

    if (reactionArticle) {
      this.reactionArticleRepository.delete({ id: reactionArticle.id });
      const res = await this.articleService.decreaseLikeCount(article);
      const response = {
        ...res,
        isLike: false,
      };
      return response;
    } else {
      this.reactionArticleRepository.save({ userId, articleId, type });
      const res = await this.articleService.increaseLikeCount(article);
      const response = {
        ...res,
        isLike: true,
      };
      return response;
    }
  }

  async commentCreateOrDelete(
    userId: number,
    articleId: number,
    commentId: number,
    type: ReactionCommentType = ReactionCommentType.LIKE,
  ): Promise<LikeCommentDto> {
    const reactionArticle = await this.reactionCommentRepository.findOne({
      userId,
      commentId,
      type,
    });
    const comment = await this.commentService.getOne(commentId);

    if (reactionArticle) {
      this.reactionCommentRepository.delete({ id: reactionArticle.id });
      const res = await this.commentService.decreaseLikeCount(comment);
      const response = {
        ...res,
        isLike: false,
      };
      return response;
    } else {
      this.reactionCommentRepository.save({
        userId,
        articleId,
        commentId,
        type,
      });
      const res = await this.commentService.increaseLikeCount(comment);
      const response = {
        ...res,
        isLike: true,
      };
      return response;
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

  findAllArticleByUserId(
    userId: number,
    options?: PageOptionsDto,
  ): Promise<PageDto<ReactionArticle>> {
    return this.reactionArticleRepository.findAllArticleByUserId(
      userId,
      options,
    );
  }
}
