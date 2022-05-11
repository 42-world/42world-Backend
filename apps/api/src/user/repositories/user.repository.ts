import { User } from '@app/entity/user/user.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async isExistById(id: number): Promise<boolean> {
    const existQuery = await this.query(`SELECT EXISTS
		(SELECT * FROM user WHERE id=${id} AND deleted_at IS NULL)`);
    const isExist = Object.values(existQuery[0])[0];
    return isExist === '1' ? true : false;
  }
}
