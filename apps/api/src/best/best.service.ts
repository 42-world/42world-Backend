import { ArticleService } from '@api/article/article.service';
import { PaginationRequestDto } from '@api/pagination/dto/pagination-request.dto';
import { Article } from '@app/entity/article/article.entity';
import { Best } from '@app/entity/best/best.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateBestRequestDto } from './dto/request/create-best-request.dto';

@Injectable()
export class BestService {
  constructor(
    @InjectRepository(Best)
    private readonly bestRepository: Repository<Best>,
    private readonly articleService: ArticleService,
  ) {}

  async createOrNot(createBestDto: CreateBestRequestDto): Promise<Best | never> {
    try {
      return await this.bestRepository.save(createBestDto);
    } catch (error) {
      if (error instanceof QueryFailedError) return;
    }
  }

  async findAll(findAllBestDto: PaginationRequestDto): Promise<Article[]> {
    return this.articleService.findAllBest(findAllBestDto);
  }

  async remove(id: number): Promise<void | never> {
    const result = await this.bestRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Best with id ${id}`);
    }
  }
}
