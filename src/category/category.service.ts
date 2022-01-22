import { CategoryRepository } from './repositories/category.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryRepository.save(createCategoryDto);
  }

  findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  existOrFail(id: number): Promise<void> {
    return this.categoryRepository.existOrFail(id);
  }

  async updateName(id: number, name: string): Promise<Category> {
    const category = await this.categoryRepository.findOneOrFail(id);

    category.name = name;
    return await this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const result = await this.categoryRepository.softDelete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Category with id ${id}`);
    }
  }
}
