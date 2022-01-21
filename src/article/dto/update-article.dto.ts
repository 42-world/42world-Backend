import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsNotEmpty, Min } from 'class-validator';

export class UpdateArticleDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional({ example: '수정된 제목 입니다.' })
  readonly title?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional({ example: '수정된 내용 입니다.' })
  readonly content?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  @ApiPropertyOptional({ example: 2 })
  readonly categoryId?: number;
}
