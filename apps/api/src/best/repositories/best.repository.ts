import { Best } from '@app/entity/best/best.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Best)
export class BestRepository extends Repository<Best> {}
