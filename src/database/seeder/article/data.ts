import { PartialType } from '@nestjs/mapped-types';
import { Article } from '@root/article/entities/article.entity';

export class SeederDataArticle extends PartialType(Article) {
  id: number;
  category_id?: number;
  writer_id?: number;
}

export const articles: SeederDataArticle[] = [
  {
    id: 1,
    title: 'title1',
    content: 'haha',
    category_id: 1,
    writer_id: 1,
  },
  {
    id: 2,
    title: 'title2',
    content: 'haha haha',
    category_id: 1,
    writer_id: 2,
  },
  {
    id: 3,
    title: 'title3',
    content: 'haha haha haha',
    category_id: 2,
    writer_id: 1,
  },
];
