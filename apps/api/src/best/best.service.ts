import { ArticleService } from '@api/article/article.service';
import { PaginationRequestDto } from '@api/pagination/dto/pagination-request.dto';
import { Article } from '@app/entity/article/article.entity';
import { Best } from '@app/entity/best/best.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { CreateBestRequestDto } from './dto/request/create-best-request.dto';
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
