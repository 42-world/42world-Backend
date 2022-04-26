import { PaginationRequestDto } from '@api/pagination/dto/pagination-request.dto';
import { Type } from 'class-transformer';

export class SearchAllRequestDto extends PaginationRequestDto {
  @Type(() => Number)
  readonly categoryId: number;
}
