import { IsString, IsInt, IsNotEmpty, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '@root/user/dto/response/user-response.dto';
import { CategoryResponseDto } from '@root/category/dto/response/category-response.dto';
import { AnonyUserResponseDto } from '@root/user/dto/response/anony-user-response.dto';

export class BaseArticleDto {
  @ApiProperty()
  id!: number;

  @IsString()
  @MaxLength(42)
  @IsNotEmpty()
  @ApiProperty({ example: '제목 입니다.' })
  title!: string;

  @IsString()
  @MaxLength(4242)
  @IsNotEmpty()
  @ApiProperty({ example: '내용 입니다.' })
  content!: string;

  @ApiProperty()
  viewCount!: number;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  categoryId!: number;

  @ApiProperty({ type: () => CategoryResponseDto })
  category?: CategoryResponseDto;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty()
  writerId!: number;

  @ApiProperty({ type: () => UserResponseDto })
  writer?: UserResponseDto | AnonyUserResponseDto;

  @ApiProperty()
  commentCount!: number;

  @ApiProperty()
  likeCount!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty()
  deletedAt?: Date;
}
