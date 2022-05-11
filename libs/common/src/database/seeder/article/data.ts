import { Article } from '@app/entity/article/article.entity';
import { PartialType } from '@nestjs/mapped-types';

export class SeederDataArticle extends PartialType(Article) {
  categoryId?: number;
  writerId?: number;
}

export const articles: SeederDataArticle[] = [
  {
    title: 'title1',
    content: 'haha',
    categoryId: 1,
    writerId: 1,
  },
  {
    title: 'title2',
    content: 'haha haha',
    categoryId: 1,
    writerId: 2,
  },
  {
    title: 'title3',
    content: 'haha haha haha',
    categoryId: 2,
    writerId: 1,
  },
  {
    title: 'title4',
    content: 'haha haha haha',
    categoryId: 2,
    writerId: 1,
  },
  {
    title: 'title5',
    content: 'haha haha haha',
    categoryId: 2,
    writerId: 1,
  },
  {
    title: 'title6',
    content: 'haha haha haha',
    categoryId: 2,
    writerId: 1,
  },
  {
    title: 'title7',
    content: 'haha haha haha',
    categoryId: 2,
    writerId: 1,
  },
  {
    title: 'title8',
    content: 'haha haha haha',
    categoryId: 2,
    writerId: 1,
  },
];
