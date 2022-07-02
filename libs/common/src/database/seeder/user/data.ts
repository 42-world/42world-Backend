import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { User } from '@app/entity/user/user.entity';
import { PartialType } from '@nestjs/mapped-types';

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
    githubUid: 'noviceUserGithubUid',
    nickname: 'noviceUserNickName',
    githubUsername: 'noviceGithubUserName',
    role: UserRole.NOVICE,
  },
  {
    id: 2,
    githubUid: 'cadetGithubUid',
    nickname: 'cadetNickname',
    githubUsername: 'cadetGithubUsername',
    role: UserRole.CADET,
  },
  {
    id: 3,
    githubUid: 'adminGithubUid',
    nickname: 'adminNickname',
    githubUsername: 'adminGithubUsername',
    role: UserRole.ADMIN,
  },
];
