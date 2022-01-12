import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Article } from '@article/entities/article.entity';
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
