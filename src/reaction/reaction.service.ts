import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

    if (reactionArticle) {
      return this.reactionArticleRepository.delete({ id: reactionArticle.id });
    } else {
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

    if (reactionArticle) {
      return this.reactionCommentRepository.delete({ id: reactionArticle.id });
    } else {
      return this.reactionCommentRepository.save({ userId, commentId, type });
    }
  }
}
