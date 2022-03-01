import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationRequestDto } from '@root/pagination/dto/pagination-request.dto';
import { Type } from 'class-transformer';

export class FindArticleRequestDto extends PaginationRequestDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional({ example: 1 })
  readonly categoryId?: number;
}
