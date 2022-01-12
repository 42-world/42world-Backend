import { PartialType } from '@nestjs/mapped-types';
import { Category } from '@category/entities/category.entity';

export class SeederDataCategory extends PartialType(Category) {
  id: number;
  name: string;
}

export const categories: SeederDataCategory[] = [
  {
    id: 1,
    name: '자유게시판',
  },
  {
    id: 2,
    name: '자유게시판2',
  },
];
