import { ApiProperty, PickType } from '@nestjs/swagger';
import { Category } from '@root/category/entities/category.entity';
import { User } from '@root/user/entities/user.entity';
import { UserRole } from '@root/user/interfaces/userrole.interface';
import { compareRole } from '@root/utils';
import { BaseCategoryDto } from '../base-category.dto';

export class CategoryUserAbilityResponseDto extends PickType(BaseCategoryDto, [
  'id',
  'name',
  'anonymity',
]) {
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
    anonymity: boolean;
  }) {
    super();

    this.id = config.id;
    this.name = config.name;
    this.isArticleWritable = config.isArticleWritable;
    this.isArticleReadable = config.isArticleReadable;
    this.isCommentWritable = config.isCommentWritable;
    this.isCommentReadable = config.isCommentReadable;
    this.isReactionable = config.isReactionable;
    this.anonymity = config.anonymity;
  }

  static of(config: {
    category: Category;
    user: User;
  }): CategoryUserAbilityResponseDto {
    const userRole = config.user.role as UserRole;
    return new CategoryUserAbilityResponseDto({
      ...config.category,
      isArticleWritable: compareRole(
        config.category.writableArticle as UserRole,
        userRole,
      ),
      isArticleReadable: compareRole(
        config.category.readableArticle as UserRole,
        userRole,
      ),
      isCommentWritable: compareRole(
        config.category.writableComment as UserRole,
        userRole,
      ),
      isCommentReadable: compareRole(
        config.category.readableComment as UserRole,
        userRole,
      ),
      isReactionable: compareRole(
        config.category.reactionable as UserRole,
        userRole,
      ),
    });
  }
}
