import { IsString, IsInt, IsNotEmpty, Min, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Article } from '@root/article/entities/article.entity';
import { User } from '@root/user/entities/user.entity';

export class BaseCommentDto {
  @ApiProperty()
  id!: number;

  @IsString()
  @MaxLength(420)
  @IsNotEmpty()
  @ApiProperty({ example: '댓글 입니다.' })
  content!: string;

  @ApiProperty()
  likeCount!: number;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  articleId!: number;

  @ApiProperty()
  article?: Article;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty()
  writerId!: number;

  @ApiProperty({ type: () => User })
  writer?: User;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty()
  deletedAt?: Date;
}
