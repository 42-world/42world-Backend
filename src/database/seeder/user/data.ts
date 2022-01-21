import { PartialType } from '@nestjs/mapped-types';
import { User, UserRole } from '@user/entities/user.entity';

export class SeederDataUser extends PartialType(User) {
  id: number;
  oauthToken: string;
  nickname: string;
}

export const users: SeederDataUser[] = [
  {
    id: 1,
    oauthToken: 'test1234',
    nickname: 'first user',
  },
  {
    id: 2,
    oauthToken: 'test2345',
    nickname: 'second user',
  },
];
