import { ApiPropertyOptional, PartialType, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { BaseArticleDto } from '@article/dto/base-article.dto';

export class UpdateArticleRequestDto extends PickType(
  PartialType(BaseArticleDto),
  ['title', 'content', 'categoryId'],
) {
  @IsOptional()
  @ApiPropertyOptional({ example: '수정된 제목 입니다.' })
  readonly title?: string;

  @IsOptional()
  @ApiPropertyOptional({ example: '수정된 내용 입니다.' })
  readonly content?: string;

  @IsOptional()
  @ApiPropertyOptional({ example: 2 })
  readonly categoryId?: number;
}
