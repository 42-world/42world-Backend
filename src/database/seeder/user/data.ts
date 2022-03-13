import { PartialType } from '@nestjs/mapped-types';
import { User } from '@user/entities/user.entity';
import { UserRole } from '@user/interfaces/userrole.interface';

export class SeederDataUser extends PartialType(User) {
  id: number;
  githubUid: string;
  nickname: string;
  githubUsername: string;
  role: UserRole;
}

export const users: SeederDataUser[] = [
  {
    id: 1,
    githubUid: 'test1234',
    nickname: 'first_user',
    githubUsername: 'github_first_user',
    role: UserRole.CADET,
  },
  {
    id: 2,
    githubUid: 'test2345',
    nickname: 'second_user',
    githubUsername: 'github_second_user',
    role: UserRole.NOVICE,
  },
];
