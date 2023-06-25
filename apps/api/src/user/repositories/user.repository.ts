import { User } from '@app/entity/user/user.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
  async isExistById(id: number): Promise<boolean> {
    const existQuery = await this.query(`SELECT EXISTS
		(SELECT * FROM user WHERE id=${id} AND deleted_at IS NULL)`);
    const isExist = Object.values(existQuery[0])[0];
    return isExist === '1' ? true : false;
  }
}
