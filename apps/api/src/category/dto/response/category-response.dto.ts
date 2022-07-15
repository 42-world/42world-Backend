import { Category } from '@app/entity/category/category.entity';
import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { User } from '@app/entity/user/user.entity';
import { compareRole } from '@app/utils/utils';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { BaseCategoryDto } from '../base-category.dto';

export class CategoryResponseDto extends PickType(BaseCategoryDto, ['id', 'name', 'isAnonymous']) {
  @ApiProperty({ example: true })
  isArticleWritable!: boolean;

  @ApiProperty({ example: true })
  isArticleReadable!: boolean;

  @ApiProperty({ example: true })
  isCommentWritable!: boolean;

  @ApiProperty({ example: true })
  isCommentReadable!: boolean;

  @ApiProperty({ example: true })
  isReactionable!: boolean;

  constructor(config: {
    id: number;
    name: string;
    isArticleWritable: boolean;
    isArticleReadable: boolean;
    isCommentWritable: boolean;
    isCommentReadable: boolean;
    isReactionable: boolean;
    isAnonymous: boolean;
  }) {
    super();

    this.id = config.id;
    this.name = config.name;
    this.isArticleWritable = config.isArticleWritable;
    this.isArticleReadable = config.isArticleReadable;
    this.isCommentWritable = config.isCommentWritable;
    this.isCommentReadable = config.isCommentReadable;
    this.isReactionable = config.isReactionable;
    this.isAnonymous = config.isAnonymous;
  }

  static of(config: { category: Category; user: User }): CategoryResponseDto {
    const userRole = config.user.role as UserRole;
    const writableArticle = config.category.writableArticle as UserRole;
    const readableArticle = config.category.readableArticle as UserRole;
    const writableComment = config.category.writableComment as UserRole;
    const readableComment = config.category.readableComment as UserRole;
    const reactionable = config.category.reactionable as UserRole;

    return new CategoryResponseDto({
      ...config.category,
      isArticleWritable: compareRole(writableArticle, userRole),
      isArticleReadable: compareRole(readableArticle, userRole),
      isCommentWritable: compareRole(writableComment, userRole),
      isCommentReadable: compareRole(readableComment, userRole),
      isReactionable: compareRole(reactionable, userRole),
      isAnonymous: config.category.anonymity,
    });
  }
}
