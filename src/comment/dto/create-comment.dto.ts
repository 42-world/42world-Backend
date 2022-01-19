import { IsString, IsInt } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  readonly content!: string;

  @IsInt()
  readonly article_id!: number;
}
