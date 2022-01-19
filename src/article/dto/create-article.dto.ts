import { IsString, IsInt } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  readonly title!: string;

  @IsString()
  readonly content!: string;

  @IsInt()
  readonly category_id!: number;
}
