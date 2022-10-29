import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UpdateArticleRequestDto {
  @MaxLength(42)
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '수정된 제목 입니다.' })
  readonly title?: string;

  @MaxLength(4242)
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '수정된 내용 입니다.' })
  readonly content?: string;

  @Min(0)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @ApiPropertyOptional({ example: 1 })
  readonly categoryId?: number;
}
