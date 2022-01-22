import { IsInt, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindAllArticleDto {
  @IsInt()
  @Min(0)
  @IsOptional()
  @ApiPropertyOptional({ example: 1 })
  readonly categoryId?: number;
}
