import { IsString, IsInt, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '댓글 입니다.' })
  readonly content!: string;

  @IsInt()
  @Min(0)
  @ApiProperty({ example: 1 })
  readonly article_id!: number;
}
