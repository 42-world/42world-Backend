import { Category } from '@app/entity/category/category.entity';
import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { PartialType } from '@nestjs/mapped-types';

export class SeederDataCategory extends PartialType(Category) {
  id: number;
  name: string;
}

export const categories: SeederDataCategory[] = [
  {
    id: 1,
    name: '자유게시판',
    writableArticle: UserRole.CADET,
    readableArticle: UserRole.CADET,
    writableComment: UserRole.CADET,
    readableComment: UserRole.CADET,
    reactionable: UserRole.CADET,
    anonymity: false,
  },
  {
    id: 2,
    name: '익명게시판',
    writableArticle: UserRole.CADET,
    readableArticle: UserRole.CADET,
    writableComment: UserRole.CADET,
    readableComment: UserRole.CADET,
    reactionable: UserRole.CADET,
    anonymity: true,
  },
  {
    id: 3,
    name: '42born2code 공지',
    writableArticle: UserRole.ADMIN,
    readableArticle: UserRole.CADET,
    writableComment: UserRole.ADMIN,
    readableComment: UserRole.ADMIN,
    reactionable: UserRole.ADMIN,
    anonymity: false,
  },
];
