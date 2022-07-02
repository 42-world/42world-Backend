import { BaseArticleDto } from '@api/article/dto/base-article.dto';
import { PickType } from '@nestjs/swagger';

export class CreateArticleRequestDto extends PickType(BaseArticleDto, ['title', 'content', 'categoryId']) {}
