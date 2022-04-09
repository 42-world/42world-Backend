import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Category } from '@api/category/entities/category.entity';
import { categories } from './data';

@Injectable()
export class CategorySeederService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  create() {
    return this.categoryRepository.save(categories);
  }
}
