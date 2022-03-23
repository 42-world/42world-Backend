import { Injectable, NotFoundException } from '@nestjs/common';
import { ArticleService } from '@root/article/article.service';
import { Article } from '@root/article/entities/article.entity';
import { PaginationRequestDto } from '@root/pagination/dto/pagination-request.dto';
import { QueryFailedError } from 'typeorm';
import { CreateBestRequestDto } from './dto/request/create-best-request.dto';
import { Best } from './entities/best.entity';
import { BestRepository } from './repositories/best.repository';

@Injectable()
export class BestService {
  constructor(
    private readonly bestRepository: BestRepository,
    private readonly articleService: ArticleService,
  ) {}

  async createOrNot(
    createBestDto: CreateBestRequestDto,
  ): Promise<Best | never> {
    try {
      return await this.bestRepository.save(createBestDto);
    } catch (error) {
      if (error instanceof QueryFailedError) return;
    }
  }

  findAll(findAllBestDto: PaginationRequestDto): Promise<Article[]> {
    return this.articleService.findAllBest(findAllBestDto);
  }

  async remove(id: number): Promise<void | never> {
    const result = await this.bestRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Best with id ${id}`);
    }
  }
}
