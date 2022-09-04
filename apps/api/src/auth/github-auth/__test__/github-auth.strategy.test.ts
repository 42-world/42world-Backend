import { ConfigService } from '@nestjs/config';
import { mock, mockFn } from 'jest-mock-extended';
import { VerifiedCallback } from 'passport-jwt';
import { GithubAuthStrategy } from '../github-auth.strategy';

describe('GithubAuthStrategy', () => {
  const mockConfigService = mock<ConfigService>({
    get: mockFn().mockReturnValue('test'),
  });
  const githubAuthStrategy = new GithubAuthStrategy(mockConfigService);

  describe('validate', () => {
    it('GithubProfile이 반환된다', async () => {
      const accessToken = '';
      const refreshToken = '';
      const profile = {
        id: 'testid',
        username: 'testusername',
        other: 'zzz',
      };
      const done = mockFn<VerifiedCallback>();

      await githubAuthStrategy.validate(accessToken, refreshToken, profile, done);

      expect(done).toBeCalledWith(null, {
        id: 'testid',
        username: 'testusername',
      });
    });
  });
});
