import { ArticleResponseDto } from '@api/article/dto/response/article-response.dto';
import { AnonyUserResponseDto } from '@api/user/dto/response/anony-user-response.dto';
import { UserResponseDto } from '@api/user/dto/response/user-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

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
  writer?: UserResponseDto | AnonyUserResponseDto;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty()
  deletedAt?: Date;
}
