import { IsInt } from 'class-validator';

export class FindAllArticleDto {
  @IsInt()
  readonly categoryId?: number;
}
