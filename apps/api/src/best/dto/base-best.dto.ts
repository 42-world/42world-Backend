import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ArticleResponseDto } from '@api/article/dto/response/article-response.dto';

export class BaseBestDto {
  @ApiProperty()
  id!: number;

  @IsInt()
  @Min(0)
  @ApiProperty({ example: 1 })
  articleId!: number;

  @ApiProperty({ type: () => ArticleResponseDto })
  article?: ArticleResponseDto;
}
