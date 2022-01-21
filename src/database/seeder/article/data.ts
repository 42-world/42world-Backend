import { PartialType } from '@nestjs/mapped-types';
import { Article } from '@root/article/entities/article.entity';

export class SeederDataArticle extends PartialType(Article) {
  id: number;
  categoryId?: number;
  writerId?: number;
}

export const articles: SeederDataArticle[] = [
  {
    id: 1,
    title: 'title1',
    content: 'haha',
    categoryId: 1,
    writerId: 1,
  },
  {
    id: 2,
    title: 'title2',
    content: 'haha haha',
    categoryId: 1,
    writerId: 2,
  },
  {
    id: 3,
    title: 'title3',
    content: 'haha haha haha',
    categoryId: 2,
    writerId: 1,
  },
];
