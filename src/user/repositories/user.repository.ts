import { EntityRepository, Repository } from 'typeorm';

import { User } from '@user/entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async isExistById(id: number): Promise<boolean> {
    const exist_query = await this.query(`SELECT EXISTS
		(SELECT * FROM user WHERE id=${id} AND deleted_at IS NULL)`);
    const is_exist = Object.values(exist_query[0])[0];
    return is_exist === '1' ? true : false;
  }
}
