import { PickType } from '@nestjs/swagger';
import { BaseArticleDto } from '@article/dto/base-article.dto';

export class CreateArticleRequestDto extends PickType(BaseArticleDto, [
  'title',
  'content',
  'categoryId',
]) {}
