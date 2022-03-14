import { PickType } from '@nestjs/swagger';
import { Category } from '@root/category/entities/category.entity';
import { UserRole } from 'aws-sdk/clients/workmail';
import { BaseCategoryDto } from '../base-category.dto';

export class CategoryResponseDto extends PickType(BaseCategoryDto, [
  'id',
  'name',
  'writableArticle',
  'readableArticle',
  'writableComment',
  'readableComment',
  'reactionable',
  'anonymity',
]) {
  constructor(config: {
    id: number;
    name: string;
    writableArticle: string;
    readableArticle: string;
    writableComment: string;
    readableComment: string;
    reactionable: string;
    anonymity: boolean;
  }) {
    super();

    this.id = config.id;
    this.name = config.name;
    this.writableArticle = config.writableArticle;
    this.readableArticle = config.readableArticle;
    this.writableComment = config.writableComment;
    this.readableComment = config.readableComment;
    this.reactionable = config.reactionable;
    this.anonymity = config.anonymity;
  }

  static of(config: { category: Category }): CategoryResponseDto {
    return new CategoryResponseDto({
      ...config.category,
    });
  }

  static ofArray(config: { categories: Category[] }): CategoryResponseDto[] {
    return config.categories.map((category) => {
      return CategoryResponseDto.of({ category });
    });
  }
}
