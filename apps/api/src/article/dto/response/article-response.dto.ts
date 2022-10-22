import { CategoryResponseDto } from '@api/category/dto/response/category-response.dto';
import { UserResponseDto } from '@api/user/dto/response/user-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ArticleResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ example: '제목 입니다.' })
  title: string;

  @ApiProperty({ example: '내용 입니다.' })
  content: string;

  @ApiProperty()
  viewCount: number;

  @ApiProperty({ example: 1 })
  categoryId: number;

  @ApiProperty({ type: CategoryResponseDto })
  category: CategoryResponseDto;

  @ApiProperty()
  writerId: number;

  @ApiProperty({ type: UserResponseDto })
  writer: UserResponseDto;

  @ApiProperty()
  commentCount: number;

  @ApiProperty()
  likeCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ example: false })
  isSelf: boolean;

  @ApiProperty({ required: false, example: false, nullable: true })
  isLike?: boolean;

  constructor(property: {
    id: number;
    title: string;
    content: string;
    viewCount: number;
    categoryId: number;
    category: CategoryResponseDto;
    writerId: number;
    writer: UserResponseDto;
    commentCount: number;
    likeCount: number;
    createdAt: Date;
    updatedAt: Date;
    isSelf: boolean;
    isLike: boolean | undefined;
  }) {
    this.id = property.id;
    this.title = property.title;
    this.content = property.content;
    this.viewCount = property.viewCount;
    this.categoryId = property.categoryId;
    this.category = property.category;
    this.writerId = property.writerId;
    this.writer = property.writer;
    this.commentCount = property.commentCount;
    this.likeCount = property.likeCount;
    this.createdAt = property.createdAt;
    this.updatedAt = property.updatedAt;
    this.isSelf = property.isSelf;
    if (property.isLike !== undefined) {
      this.isLike = property.isLike;
    }
  }
}
