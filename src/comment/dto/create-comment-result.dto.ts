export class CreateCommentResultDto {
  id: number;
  content: string;
  likeCount: number;
  articleId: number;
  writerId: number;
  createdAt: Date;
  nickname: string;
}
