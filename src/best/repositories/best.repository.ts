import { EntityRepository, Repository } from 'typeorm';
import { Best } from '../entities/best.entity';

@EntityRepository(Best)
export class BestRepository extends Repository<Best> {}
