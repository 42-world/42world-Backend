import { PaginationRequestDto } from '@api/pagination/dto/pagination-request.dto';
import { Article } from '@app/entity/article/article.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ArticleRepository } from './repositories/article.repository';

@Injectable()
export class ArticleService {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async findAllByWriterId(
    writerId: number,
    options: PaginationRequestDto,
  ): Promise<{ articles: Article[]; totalCount: number }> {
    return this.articleRepository.findAllByWriterId(writerId, options);
  }

  async findAllBest(options: PaginationRequestDto): Promise<Article[]> {
    return this.articleRepository.findAllBest(options);
  }

  async findOneByIdOrFail(id: number): Promise<Article> {
    return this.articleRepository.findOneOrFail(id);
  }

  async increaseCommentCount(articleId: number): Promise<void> {
    await this.articleRepository.update(articleId, {
      commentCount: () => 'comment_count + 1',
    });
  }

  async decreaseCommentCount(articleId: number): Promise<void> {
    await this.articleRepository.update(articleId, {
      commentCount: () => 'comment_count - 1',
    });
  }

  async increaseLikeCount(article: Article): Promise<Article> {
    await this.articleRepository.update(article.id, {
      likeCount: () => 'like_count + 1',
    });
    article.likeCount += 1;
    return article;
  }

  async decreaseLikeCount(article: Article): Promise<Article | never> {
    if (article.likeCount <= 0) {
      throw new BadRequestException('좋아요는 0이하가 될 수 없습니다.');
    }
    await this.articleRepository.update(article.id, {
      likeCount: () => 'like_count - 1',
    });
    article.likeCount -= 1;
    return article;
  }
}
