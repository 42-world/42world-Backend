import { CategoryService } from '@api/category/category.service';
import { Article } from '@app/entity/article/article.entity';
import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { User } from '@app/entity/user/user.entity';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PaginationRequestDto } from '../pagination/dto/pagination-request.dto';
import { ArticleRepository } from './repositories/article.repository';

@Injectable()
export class ArticleApiService {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly categoryService: CategoryService,
  ) {}

  async create(writer: User, title: string, content: string, categoryId: number): Promise<Article> {
    await this.categoryService.checkAvailable(writer, categoryId, 'writableArticle');

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
    user: User,
    q: string,
    categoryId: number,
    options: PaginationRequestDto,
  ): Promise<{ articles: Article[]; totalCount: number }> {
    const availableCategories = await this.categoryService.getAvailable(user);

    let availableCategoryIds = availableCategories.map((category) => category.id);

    if (categoryId) {
      if (!availableCategoryIds.some((availableCategoryId) => availableCategoryId === categoryId)) {
        throw new ForbiddenException(`Category ${categoryId} is not available`);
      }
      availableCategoryIds = [categoryId];
    }

    return await this.articleRepository.search(q, availableCategoryIds, options);
  }

  async findOneById(user: User, id: number): Promise<Article> {
    const article = await this.articleRepository.findOneOrFail(id, {
      relations: ['writer', 'category'],
    });

    await this.categoryService.checkAvailable(user, article.categoryId, 'readableArticle');

    if (article.writerId !== user.id) {
      await this.articleRepository.update(id, {
        viewCount: () => 'view_count + 1',
      });
    }

    return article;
  }

  async findAllByCategoryId(
    user: User,
    categoryId: number,
    options: PaginationRequestDto,
  ): Promise<{ articles: Article[]; totalCount: number }> {
    await this.categoryService.checkAvailable(user, categoryId, 'readableArticle');

    return await this.articleRepository.findAllByCategoryId(categoryId, options);
  }

  async update(
    user: User,
    id: number,
    title: string | null,
    content: string | null,
    categoryId: number | null,
  ): Promise<void> {
    const article = await this.articleRepository.findOneOrFail(id);

    if (article.writerId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('권한이 없습니다');
    }

    if (categoryId) {
      if (user.role !== UserRole.ADMIN) {
        throw new ForbiddenException('권한이 없습니다');
      }

      await this.categoryService.checkAvailable(user, categoryId, 'writableArticle');
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
}
