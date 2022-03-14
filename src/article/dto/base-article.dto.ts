import { IsString, IsInt, IsNotEmpty, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '@root/category/entities/category.entity';
import { UserResponseDto } from '@root/user/dto/response/user-response.dto';
import { CategoryUserAbilityResponseDto } from '@root/category/dto/response/category-user-ability-response.dto';

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
  category?: CategoryUserAbilityResponseDto;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty()
  writerId!: number;

  @ApiProperty({ type: () => UserResponseDto })
  writer?: UserResponseDto;

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
