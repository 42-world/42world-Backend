import { PaginationRequestDto } from '@api/pagination/dto/pagination-request.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class SearchArticleRequestDto extends PaginationRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '검색할 단어' })
  readonly q: string;

  @Min(0)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({ example: 2 })
  readonly categoryId?: number;
}
