import { UserService } from '@api/user/user.service';
import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { User } from '@app/entity/user/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { mock, mockFn } from 'jest-mock-extended';
import { AuthService } from '../auth.service';
import { GithubProfile } from '../types';

describe('AuthService', () => {
  const mockUserSerivce = mock<UserService>();
  const mockJwtService = mock<JwtService>({
    sign: mockFn().mockReturnValue('jwt'),
  });
  const mockConfigService = mock<ConfigService>();
  const authService = new AuthService(mockUserSerivce, mockJwtService, mockConfigService);

  beforeEach(() => {
    mockUserSerivce.findOneByGithubUId.mockClear();
    mockConfigService.get.mockClear();
    jest.clearAllTimers();
  });

  describe('login', () => {
    test('이미 가입한 유저는 로그인 시간을 업데이트 한다', async () => {
      const user = new User();
      const oldLastLogin = new Date();
      user.lastLogin = oldLastLogin;
      user.save = mockFn().mockReturnThis();

      const githubProfile: GithubProfile = { id: '1', username: 'test' };
      mockUserSerivce.findOneByGithubUId.mockResolvedValue(user);

      const result: User = await authService.login(githubProfile);

      expect(result).toBeDefined();
      expect(result.lastLogin).not.toBe(oldLastLogin);
    });

    test('처음 로그인하는 유저는 유저를 생성한다', async () => {
      const githubProfile: GithubProfile = { id: '1', username: 'test' };
      mockUserSerivce.findOneByGithubUId.mockResolvedValue(undefined);
      mockUserSerivce.create.mockImplementation(async (user: User) => user);

      const result: User = await authService.login(githubProfile);

      expect(result).toBeDefined();
      expect(result.nickname).toBe(githubProfile.username);
      expect(result.githubUsername).toBe(githubProfile.username);
      expect(result.githubUid).toBe(githubProfile.id);
      expect(mockUserSerivce.create).toBeCalledTimes(1);
    });
  });

  describe('getJwt', () => {
    test('jwt를 만든다', async () => {
      const user = new User();
      user.id = 1;
      user.role = UserRole.ADMIN;

      const result = authService.getJwt(user);

      expect(result).toBe('jwt');
      expect(mockJwtService.sign).toBeCalledTimes(1);
      expect(mockJwtService.sign).toBeCalledWith({ userId: 1, userRole: UserRole.ADMIN });
    });
  });

  describe('getCookieOption', () => {
    test('prod 일떄 쿠키 옵션', async () => {
      mockConfigService.get.mockReturnValue('prod');

      const result = authService.getCookieOption();

      expect(result).toMatchInlineSnapshot(`
        Object {
          "httpOnly": true,
          "maxAge": 604800000,
          "sameSite": "lax",
          "secure": true,
        }
      `);
    });

    test('alpha 일떄 쿠키 옵션', async () => {
      mockConfigService.get.mockReturnValue('alpha');

      const result = authService.getCookieOption();

      expect(result).toMatchInlineSnapshot(`
        Object {
          "httpOnly": true,
          "maxAge": 604800000,
          "sameSite": "none",
          "secure": true,
        }
      `);
    });

    test('dev/test 일때 쿠키 옵션', async () => {
      mockConfigService.get.mockReturnValue('dev');

      const result = authService.getCookieOption();

      expect(result).toMatchInlineSnapshot(`
        Object {
          "httpOnly": true,
          "maxAge": 604800000,
        }
      `);
    });
  });
});
