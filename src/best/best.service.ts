import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBestDto } from './dto/create-best.dto';
import { FindAllBestDto } from './dto/find-all-best.dto';
import { Best } from './entities/best.entity';
import { BestRepository } from './repositories/best.repository';

@Injectable()
export class BestService {
  constructor(private readonly bestRepository: BestRepository) {}

  async create(createBestDto: CreateBestDto): Promise<Best> {
    try {
      return await this.bestRepository.save(createBestDto);
    } catch (error) {
      throw new ConflictException();
    }
  }

  findAll(findAllBestDto: FindAllBestDto): Promise<Best[]> {
    return this.bestRepository.findAll(findAllBestDto);
  }

  async remove(id: number) {
    const result = await this.bestRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Best with id ${id}`);
    }
  }
}
