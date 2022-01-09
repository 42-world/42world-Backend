import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Category } from '@category/entities/category.entity';
import { categories } from './data';

@Injectable()
export class CategorySeederService {
  constructor(
    @InjectRepository(Category)
    private readonly userRepository: Repository<Category>,
  ) {}

  create() {
    return this.userRepository.save(categories);
  }
}
