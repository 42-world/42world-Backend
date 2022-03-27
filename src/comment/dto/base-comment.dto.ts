import { IsString, IsInt, IsNotEmpty, Min, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '@root/user/dto/response/user-response.dto';
import { ArticleResponseDto } from '@root/article/dto/response/article-response.dto';

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

  @ApiProperty({ type: () => ArticleResponseDto })
  article?: ArticleResponseDto;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty()
  writerId!: number;

  @ApiProperty({ type: () => UserResponseDto })
  writer?: UserResponseDto;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty()
  deletedAt?: Date;
}
