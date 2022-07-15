import { Category } from '@app/entity/category/category.entity';
import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { User } from '@app/entity/user/user.entity';
import { compareRole, includeRole } from '@app/utils/utils';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryRequestDto } from './dto/request/create-category-request.dto';
import { CategoryRepository } from './repositories/category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(createCategoryDto: CreateCategoryRequestDto): Promise<Category> {
    return this.categoryRepository.save(createCategoryDto);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async findOneOrFail(id: number): Promise<Category | never> {
    return this.categoryRepository.findOneOrFail(id);
  }

  async existOrFail(id: number): Promise<void | never> {
    return this.categoryRepository.existOrFail(id);
  }

  async updateName(id: number, name: string): Promise<Category | never> {
    const category = await this.categoryRepository.findOneOrFail(id);

    category.name = name;
    return this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void | never> {
    const result = await this.categoryRepository.softDelete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Category with id ${id}`);
    }
  }

  checkAvailable(
    key: keyof Pick<
      Category,
      'writableArticle' | 'readableArticle' | 'writableComment' | 'readableComment' | 'reactionable'
    >,
    category: Category,
    user: User,
  ): void | never {
    if (!compareRole(category[key] as UserRole, user.role as UserRole))
      throw new ForbiddenException(`당신은 ${category.name} 카테고리의 ${key} 하지 않습니다.`);
  }

  getAvailable(user: User): Promise<Category[]> {
    const availableRole = includeRole(user.role as UserRole);
    return this.categoryRepository.getAvailable(availableRole);
  }
}
