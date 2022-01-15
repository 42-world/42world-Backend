import { PartialType } from '@nestjs/mapped-types';
import { User, UserRole } from '@user/entities/user.entity';

export class SeederDataUser extends PartialType(User) {
  id: number;
  nickname: string;
}

export const users: SeederDataUser[] = [
  {
    id: 1,
    nickname: 'first user',
  },
  {
    id: 2,
    nickname: 'second user',
  },
];
