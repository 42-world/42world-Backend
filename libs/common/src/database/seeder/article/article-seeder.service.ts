import { Article } from '@app/entity/article/article.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { articles } from './data';

@Injectable()
export class ArticleSeederService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async create() {
    return this.articleRepository.save(articles);
  }
}
