import { User, UserRole } from '@user/entities/user.entity';

export const users: User[] = [
  {
    id: 1,
    nickname: 'first user',
    is_authenticated: true,
    role: UserRole.CADET,
    picture: '',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    nickname: 'second user',
    is_authenticated: true,
    role: UserRole.CADET,
    picture: '',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
];
