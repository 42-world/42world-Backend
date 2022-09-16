import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { mock, mockFn } from 'jest-mock-extended';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { GithubProfile } from '../types';

describe('AuthController', () => {
  const mockAuthService = mock<AuthService>({
    login: mockFn().mockResolvedValue({ id: 1 }),
    getJwt: mockFn().mockReturnValue('jwt'),
    getCookieOption: mockFn().mockReturnValue({ cookie: 'test' }),
  });
  const mockConfigService = mock<ConfigService>({
    get: mockFn().mockReturnValue('access-token-key'),
  });
  const authController = new AuthController(mockAuthService, mockConfigService);

  beforeEach(() => {
    jest.clearAllTimers();
  });

  describe('githubLogin', () => {
    test('정상 호출', async () => {
      const actual = () => authController.githubLogin();

      expect(actual).not.toThrow();
    });
  });

  describe('githubCallback', () => {
    test('로그인하면 쿠키를 세팅한다', async () => {
      const githubProfile: GithubProfile = { id: '1', username: 'test' };
      const mockResponse = mock<Response>({
        cookie: mockFn().mockReturnThis(),
      });

      await authController.githubCallback(githubProfile, mockResponse);

      expect(mockResponse.cookie).toBeCalledTimes(1);
      expect(mockResponse.cookie).toBeCalledWith('access-token-key', 'jwt', { cookie: 'test' });
    });
  });

  describe('signout', () => {
    test('로그아웃하면 쿠키를 비운다', async () => {
      const mockResponse = mock<Response>({
        clearCookie: mockFn().mockReturnThis(),
      });

      authController.signout(mockResponse);

      expect(mockResponse.clearCookie).toBeCalledTimes(1);
      expect(mockResponse.clearCookie).toBeCalledWith('access-token-key', { cookie: 'test' });
    });
  });
});
