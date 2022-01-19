import { Injectable, NotFoundException } from '@nestjs/common';
import { ArticleRepository } from './repositories/article.repository';
import { FindAllArticleDto } from './dto/find-all-article.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticleService {
  constructor(private readonly articleRepository: ArticleRepository) {}

  create(
    writer_id: number,
    createArticleDto: CreateArticleDto,
  ): Promise<Article> {
    return this.articleRepository.save({ ...createArticleDto, writer_id });
  }

  findAll(options?: FindAllArticleDto): Promise<Article[]> {
    return this.articleRepository.findAll(options);
  }

  getOne(id: number): Promise<Article> {
    return this.articleRepository.getOneOrFail(id);
  }

  async existOrFail(id: number): Promise<void> {
    const isExist = await this.articleRepository.isExistById(id);

    if (!isExist) {
      throw new NotFoundException(`Can't find Article with id ${id}`);
    }
  }

  async update(
    id: number,
    writer_id: number,
    updateArticleDto: UpdateArticleDto,
  ): Promise<void> {
    const article = await this.articleRepository.findOneOrFail({
      id,
      writer_id,
    });
    const new_article = {
      ...article,
      ...updateArticleDto,
    };

    this.articleRepository.save(new_article);
  }

  async remove(id: number, writer_id: number): Promise<void> {
    const result = await this.articleRepository.delete({ id, writer_id });

    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Article with id ${id}`);
    }
  }
}
