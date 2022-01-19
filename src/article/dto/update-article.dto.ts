import { IsString, IsInt } from 'class-validator';

export class UpdateArticleDto {
  @IsString()
  readonly title?: string;

  @IsString()
  readonly content?: string;

  @IsInt()
  readonly category_id?: number;
}
