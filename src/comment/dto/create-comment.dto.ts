export class CreateCommentDto {
  readonly content!: string;
  readonly article_id!: number;
  readonly writer_id!: number;
}
