import { EntityRepository, Repository } from 'typeorm';

import { User } from '@user/entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async isExistById(id: number): Promise<boolean> {
    const existQuery = await this.query(`SELECT EXISTS
		(SELECT * FROM user WHERE id=${id} AND deleted_at IS NULL)`);
    const isExist = Object.values(existQuery[0])[0];
    return isExist === '1' ? true : false;
  }
}
