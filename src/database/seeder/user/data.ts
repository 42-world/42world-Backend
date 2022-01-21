import { PartialType } from '@nestjs/mapped-types';
import { User, UserRole } from '@user/entities/user.entity';

export class SeederDataUser extends PartialType(User) {
  id: number;
  oauth_token: string;
  nickname: string;
}

export const users: SeederDataUser[] = [
  {
    id: 1,
    oauth_token: 'test1234',
    nickname: 'first user',
  },
  {
    id: 2,
    oauth_token: 'test2345',
    nickname: 'second user',
  },
];
