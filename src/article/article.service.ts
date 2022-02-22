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
import { PageDto } from '@root/pagination/pagination.dto';
import { DetailArticleDto } from './dto/detail-article.dto';
import { ReactionService } from '@root/reaction/reaction.service';

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
  ): Promise<Article> {
    await this.categoryService.existOrFail(createArticleDto.categoryId);
    return this.articleRepository.save({ ...createArticleDto, writerId });
  }

  findAll(options?: FindArticleRequestDto): Promise<PageDto<Article>> {
    return this.articleRepository.findAll(options);
  }

  findAllBest(options: FindAllBestDto): Promise<Article[]> {
    return this.articleRepository.findAllBest(options);
  }

  existOrFail(id: number): Promise<void> {
    return this.articleRepository.existOrFail(id);
  }

  getOne(id: number): Promise<Article> {
    return this.articleRepository.findOneOrFail(id);
  }

  async getOneDetail(id: number, userId: number): Promise<DetailArticleDto> {
    const article = await this.articleRepository.getOneDetailOrFail(id);
    const isLike = await this.reactionService.isMyReactionArticle(
      userId,
      article.id,
    );

    return { ...article, isLike, isSelf: article.writerId === userId };
  }

  async update(
    id: number,
    writerId: number,
    updateArticleRequestDto: UpdateArticleRequestDto,
  ): Promise<void> {
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

    this.articleRepository.save(newArticle);
  }

  async remove(id: number, writerId: number): Promise<void> {
    const result = await this.articleRepository.softDelete({
      id,
      writerId,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Article with id ${id}`);
    }
  }

  increaseViewCount(article: Article): void {
    article.viewCount += 1;
    this.articleRepository.save(article);
  }

  increaseCommentCount(article: Article): void {
    article.commentCount += 1;
    this.articleRepository.save(article);
  }

  decreaseCommentCountById(article: Article): void {
    article.commentCount -= 1;
    this.articleRepository.save(article);
  }

  increaseLikeCount(article: Article): Promise<Article> {
    article.likeCount += 1;
    return this.articleRepository.save(article);
  }

  decreaseLikeCount(article: Article): Promise<Article> {
    if (article.likeCount <= 0) {
      throw new NotAcceptableException('좋아요는 0이하가 될 수 없습니다.');
    }
    article.likeCount -= 1;
    return this.articleRepository.save(article);
  }

  findAllMyArticle(userId: number): Promise<Article[]> {
    return this.articleRepository.findAllMyArticle(userId);
  }
}
