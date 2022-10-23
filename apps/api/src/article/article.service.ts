import { PaginationRequestDto } from '@api/pagination/dto/pagination-request.dto';
import { Article } from '@app/entity/article/article.entity';
import { Category } from '@app/entity/category/category.entity';
import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { User } from '@app/entity/user/user.entity';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { ArticleRepository } from './repositories/article.repository';

@Injectable()
export class ArticleService {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async create(writer: User, title: string, content: string, categoryId: number): Promise<Article> {
    const { id } = await this.articleRepository.save({
      title,
      content,
      categoryId,
      writerId: writer.id,
    });

    return await this.articleRepository.findOneOrFail(id, {
      relations: ['writer', 'category'],
    });
  }

  async search(
    q: string,
    categoryId: number | undefined,
    options: PaginationRequestDto,
    availableCategories: Category[],
  ): Promise<{ articles: Article[]; totalCount: number }> {
    let availableCategoryIds = availableCategories.map((availableCategory) => availableCategory.id);

    if (categoryId) {
      if (!availableCategoryIds.some((availableCategoryId) => availableCategoryId === categoryId)) {
        throw new ForbiddenException(`Category ${categoryId} is not available`);
      }
      availableCategoryIds = [categoryId];
    }

    return await this.articleRepository.search(q, availableCategoryIds, options);
  }

  async findAllByCategoryId(
    categoryId: number,
    options: PaginationRequestDto,
  ): Promise<{ articles: Article[]; totalCount: number }> {
    return await this.articleRepository.findAllByCategoryId(categoryId, options);
  }

  async findOneById(user: User, id: number): Promise<Article> {
    const article = await this.articleRepository.findOneOrFail(id, {
      relations: ['writer', 'category'],
    });

    return article;
  }

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

  async update(
    user: User,
    id: number,
    title: string | undefined,
    content: string | undefined,
    categoryId: number | undefined,
  ): Promise<void> {
    const article = await this.articleRepository.findOneOrFail(id);

    if (article.writerId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('권한이 없습니다');
    }

    if (categoryId) {
      if (user.role !== UserRole.ADMIN) {
        throw new ForbiddenException('권한이 없습니다');
      }
    }

    await this.articleRepository.update(id, {
      title: title ?? article.title,
      content: content ?? article.content,
      categoryId: categoryId ?? article.categoryId,
    });
  }

  async remove(user: User, id: number): Promise<void> {
    const article = await this.articleRepository.findOneOrFail(id);

    if (article.writerId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('권한이 없습니다');
    }

    await this.articleRepository.softDelete(id);
  }

  async increaseViewCount(user: User, article: Article): Promise<void> {
    if (article.writerId === user.id) {
      return;
    }

    await this.articleRepository.update(article.id, {
      viewCount: () => 'view_count + 1',
    });
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
