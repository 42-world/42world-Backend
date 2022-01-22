import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import { Category } from '../entities/category.entity';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  async existOrFail(id: number): Promise<void> {
    const exist_query = await this.query(`SELECT EXISTS
		(SELECT * FROM category WHERE id=${id})`);
    const is_exist = Object.values(exist_query[0])[0];
    if (!is_exist) {
      throw new NotFoundException(`Can't find Category with id ${id}`);
    }
  }
}
