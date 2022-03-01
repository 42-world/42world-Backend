import {
  forwardRef,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { ArticleRepository } from './repositories/article.repository';
import { FindArticleRequestDto } from './dto/request/find-article-request.dto';
import { CreateArticleRequestDto } from './dto/request/create-article-request.dto';
import { UpdateArticleRequestDto } from './dto/request/update-article-request.dto';
import { Article } from './entities/article.entity';
import { CategoryService } from '@root/category/category.service';
import { FindAllBestDto } from '@root/best/dto/find-all-best.dto';
import { PaginationResponseDto } from '@root/pagination/dto/pagination-response.dto';
import { ReactionService } from '@root/reaction/reaction.service';
import { Category } from '@root/category/entities/category.entity';
import { User } from '@root/user/entities/user.entity';

@Injectable()
export class ArticleService {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly categoryService: CategoryService,
    @Inject(forwardRef(() => ReactionService))
    private readonly reactionService: ReactionService,
  ) {}

  async create(
    writerId: number,
    createArticleDto: CreateArticleRequestDto,
  ): Promise<
    | {
        article: Article; //
        category: Category;
      }
    | never
  > {
    const category = await this.categoryService.findOneOrFail(
      createArticleDto.categoryId,
    );
    const article = await this.articleRepository.save({
      ...createArticleDto,
      writerId,
    });

    return { article, category };
  }

  findAll(
    options?: FindArticleRequestDto,
  ): Promise<PaginationResponseDto<Article>> {
    return this.articleRepository.findAll(options);
  }

  findAllBest(options: FindAllBestDto): Promise<Article[]> {
    return this.articleRepository.findAllBest(options);
  }

  existOrFail(id: number): Promise<void> {
    return this.articleRepository.existOrFail(id);
  }

  findOneOrFailById(id: number): Promise<Article | never> {
    return this.articleRepository.findOneOrFail(id);
  }

  async findOneOrFail(
    id: number,
    userId: number,
  ): Promise<
    | {
        article: Article;
        category: Category;
        writer: User;
        isLike: boolean;
        isSelf: boolean;
      }
    | never
  > {
    const article = await this.articleRepository.findOneOrFail(id, {
      relations: ['writer', 'category'],
    });
    const category: Category = article.category;
    const writer: User = article.writer;
    const isLike = await this.reactionService.isMyReactionArticle(
      userId,
      article.id,
    );
    const isSelf = userId === article.writerId;

    return { article, category, writer, isLike, isSelf };
  }

  async update(
    id: number,
    writerId: number,
    updateArticleRequestDto: UpdateArticleRequestDto,
  ): Promise<void | never> {
    if (updateArticleRequestDto.categoryId)
      await this.categoryService.existOrFail(
        updateArticleRequestDto.categoryId,
      );
    const article = await this.articleRepository.findOneOrFail({
      id,
      writerId,
    });
    const newArticle = {
      ...article,
      ...updateArticleRequestDto,
    };

    await this.articleRepository.save(newArticle);
  }

  async remove(id: number, writerId: number): Promise<void | never> {
    const result = await this.articleRepository.softDelete({
      id,
      writerId,
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        `Can't find Article with id ${id} with writer ${writerId}`,
      );
    }
  }

  async increaseViewCount(article: Article): Promise<void> {
    article.viewCount += 1;
    await this.articleRepository.save(article);
  }

  async increaseCommentCount(article: Article): Promise<void> {
    article.commentCount += 1;
    await this.articleRepository.save(article);
  }

  async decreaseCommentCountById(article: Article): Promise<void> {
    article.commentCount -= 1;
    await this.articleRepository.save(article);
  }

  async increaseLikeCount(article: Article): Promise<Article> {
    article.likeCount += 1;
    return await this.articleRepository.save(article);
  }

  async decreaseLikeCount(article: Article): Promise<Article> {
    if (article.likeCount <= 0) {
      throw new NotAcceptableException('좋아요는 0이하가 될 수 없습니다.');
    }
    article.likeCount -= 1;
    return await this.articleRepository.save(article);
  }

  findAllMyArticle(userId: number): Promise<Article[]> {
    return this.articleRepository.findAllMyArticle(userId);
  }
}
