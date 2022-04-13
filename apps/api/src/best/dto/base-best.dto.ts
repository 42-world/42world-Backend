import { ArticleResponseDto } from '@api/article/dto/response/article-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

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
