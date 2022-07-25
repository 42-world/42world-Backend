import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { includeRole } from './utils';

describe('includeRole', () => {
  test('ADMIN 권한을 확인하는 경우', () => {
    const result = includeRole(UserRole.ADMIN);

    expect(result.sort()).toStrictEqual([UserRole.ADMIN, UserRole.CADET, UserRole.GUEST, UserRole.NOVICE]);
  });

  test('CADET 권한을 확인하는 경우', () => {
    const result = includeRole(UserRole.CADET);

    expect(result.sort()).toStrictEqual([UserRole.CADET, UserRole.GUEST, UserRole.NOVICE]);
  });

  test('NOVICE 권한을 확인하는 경우', () => {
    const result = includeRole(UserRole.NOVICE);

    expect(result.sort()).toStrictEqual([UserRole.GUEST, UserRole.NOVICE]);
  });
});
