import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PageOptionsDto } from '@root/pagination/page-options.dto';
import { Type } from 'class-transformer';

export class FindArticleRequestDto extends PageOptionsDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional({ example: 1 })
  readonly categoryId?: number;
}
