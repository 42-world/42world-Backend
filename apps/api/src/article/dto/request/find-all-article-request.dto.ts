import { PaginationRequestDto } from '@api/pagination/dto/pagination-request.dto';
import { IntersectionType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BaseArticleDto } from '../base-article.dto';

const _PickedBaseArticle = PickType(BaseArticleDto, ['categoryId']);

export class FindAllArticleRequestDto extends IntersectionType(_PickedBaseArticle, PaginationRequestDto) {
  @Type(() => Number)
  readonly categoryId: number;
}
