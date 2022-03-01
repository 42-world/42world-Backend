import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { PageMetaDto } from './page-meta.dto';
import { PaginationRequestDto } from './pagination-request.dto';

export class PaginationResponseDto<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty({ type: () => PageMetaDto })
  readonly meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }

  static of<T>(
    data: T[],
    paginationRequestDto: PaginationRequestDto,
    totalCount: number,
  ): PaginationResponseDto<T> {
    return new PaginationResponseDto(
      data,
      new PageMetaDto(paginationRequestDto, totalCount),
    );
  }
}
