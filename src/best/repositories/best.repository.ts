import { EntityRepository, Repository } from 'typeorm';
import { FindAllBestDto } from '../dto/find-all-best.dto';
import { Best } from '../entities/best.entity';

@EntityRepository(Best)
export class BestRepository extends Repository<Best> {
  async findAll(options: FindAllBestDto): Promise<Best[]> {
    const query = this.createQueryBuilder('best');

    if (options.limit) query.limit(options.limit);

    return query.getMany();
  }
}
