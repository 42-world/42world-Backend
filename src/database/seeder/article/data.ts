import { PartialType } from '@nestjs/mapped-types';
import { Article } from '@root/article/entities/article.entity';

export class SeederDataArticle extends PartialType(Article) {
  category_id?: number;
  writer_id?: number;
}

export const articles: SeederDataArticle[] = [
  {
    title: 'title1',
    content: 'haha',
    category_id: 1,
    writer_id: 1,
  },
  {
    title: 'title2',
    content: 'haha haha',
    category_id: 1,
    writer_id: 2,
  },
];
