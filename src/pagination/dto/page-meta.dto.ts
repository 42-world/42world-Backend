import { ApiProperty } from '@nestjs/swagger';
import { PaginationRequestDto } from './pagination-request.dto';

export class PageMetaDto {
  @ApiProperty()
  readonly page: number;

  @ApiProperty({ description: '가져올 갯수' })
  readonly take: number;

  @ApiProperty()
  readonly totalCount: number;

  @ApiProperty()
  readonly pageCount: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  readonly hasNextPage: boolean;

  constructor(paginationRequestDto: PaginationRequestDto, totalCount: number) {
    this.page = paginationRequestDto.page;
    this.take = paginationRequestDto.take;
    this.totalCount = totalCount;
    this.pageCount = Math.ceil(this.totalCount / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
