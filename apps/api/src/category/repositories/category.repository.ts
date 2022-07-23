import { Category } from '@app/entity/category/category.entity';
import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  async existOrFail(id: number): Promise<void> {
    const existQuery = await this.query(`SELECT EXISTS
		(SELECT * FROM category WHERE id=${id} AND deleted_at IS NULL)`);
    const isExist = Object.values(existQuery[0])[0];
    if (isExist === '0') {
      throw new NotFoundException(`Can't find Category with id ${id}`);
    }
  }

  getAvailable(role: UserRole[]): Promise<Category[]> {
    const query = this.createQueryBuilder('category').where('category.readableArticle IN (:...userRole)', {
      userRole: role,
    });
    return query.getMany();
  }
}
