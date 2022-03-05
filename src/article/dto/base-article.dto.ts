import { IsString, IsInt, IsNotEmpty, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '@root/category/entities/category.entity';
import { User } from '@root/user/entities/user.entity';

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

  @ApiProperty()
  category?: Category;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty()
  writerId!: number;

  @ApiProperty({ type: () => User })
  writer?: User;

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
