import { CategoryRepository } from './repositories/category.repository';
import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { User } from '@root/user/entities/user.entity';
import { UserRole } from '@root/user/interfaces/userrole.interface';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryRepository.save(createCategoryDto);
  }

  findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  findOneOrFail(id: number): Promise<Category | never> {
    return this.categoryRepository.findOneOrFail(id);
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

  private compareRole(rule: UserRole, mine: UserRole): boolean {
    const toRoleId = (r: UserRole) => {
      switch (r) {
        case UserRole.ADMIN:
          return 3;
        case UserRole.CADET:
          return 2;
        case UserRole.NOVICE:
          return 1;
      }
    };
    return toRoleId(rule) <= toRoleId(mine);
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
    if (!this.compareRole(category[key] as UserRole, user.role as UserRole))
      throw new NotAcceptableException(
        `당신은 ${category.name} 카테고리의 ${key} 하지 않습니다.`,
      );
  }
}
