import { PartialType } from '@nestjs/mapped-types';
import { Category } from '@category/entities/category.entity';
import { UserRole } from '@root/user/interfaces/userrole.interface';

export class SeederDataCategory extends PartialType(Category) {
  id: number;
  name: string;
}

export const categories: SeederDataCategory[] = [
  {
    id: 1,
    name: '자유게시판',
    writableArticle: UserRole.CADET,
    readonlyArticle: UserRole.CADET,
    writableComment: UserRole.CADET,
    readonlyComment: UserRole.CADET,
    reactionable: UserRole.CADET,
    anonymity: false,
  },
  {
    id: 2,
    name: '익명게시판',
    writableArticle: UserRole.CADET,
    readonlyArticle: UserRole.CADET,
    writableComment: UserRole.CADET,
    readonlyComment: UserRole.CADET,
    reactionable: UserRole.CADET,
    anonymity: true,
  },
  {
    id: 3,
    name: '42born2code 공지',
    writableArticle: UserRole.ADMIN,
    readonlyArticle: UserRole.CADET,
    writableComment: UserRole.ADMIN,
    readonlyComment: UserRole.ADMIN,
    reactionable: UserRole.ADMIN,
    anonymity: false,
  },
];
