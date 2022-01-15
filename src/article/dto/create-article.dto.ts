export class CreateArticleDto {
  readonly title!: string;
  readonly content!: string;
  readonly category_id!: number;
  readonly writer_id!: number;
}
