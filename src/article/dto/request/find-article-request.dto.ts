import { IsOptional } from 'class-validator';
import {
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BaseArticleDto } from '../base-article.dto';
import { PaginationRequestDto } from '@root/pagination/dto/pagination-request.dto';

export class FindArticleRequestDto extends IntersectionType(
  PickType(PartialType(BaseArticleDto), ['categoryId']),
  PaginationRequestDto,
) {
  @Type(() => Number)
  @IsOptional()
  @ApiPropertyOptional({ example: 1 })
  readonly categoryId?: number;
}
