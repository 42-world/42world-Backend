import { CategoryRepository } from './repositories/category.repository';
import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { Category } from './entities/category.entity';
import { User } from '@root/user/entities/user.entity';
import { UserRole } from '@root/user/interfaces/userrole.interface';
import { CreateCategoryRequestDto } from './dto/request/create-category-request.dto';
import { compareRole } from '@root/utils';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  create(createCategoryDto: CreateCategoryRequestDto): Promise<Category> {
    return this.categoryRepository.save(createCategoryDto);
  }

  findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  findOneOrFail(id: number): Promise<Category | never> {
    return this.categoryRepository.findOneOrFail(id);
  }

  existOrFail(id: number): Promise<void | never> {
    return this.categoryRepository.existOrFail(id);
  }

  async updateName(id: number, name: string): Promise<Category | never> {
    const category = await this.categoryRepository.findOneOrFail(id);

    category.name = name;
    return await this.categoryRepository.save(category);
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
      | 'writableArticle'
      | 'readableArticle'
      | 'writableComment'
      | 'readableComment'
      | 'reactionable'
    >,
    category: Category,
    user: User,
  ): void | never {
    if (!compareRole(category[key] as UserRole, user.role as UserRole))
      throw new NotAcceptableException(
        `당신은 ${category.name} 카테고리의 ${key} 하지 않습니다.`,
      );
  }
}
