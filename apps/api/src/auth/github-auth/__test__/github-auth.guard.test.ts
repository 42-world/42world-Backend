import { BadRequestException } from '@nestjs/common';
import { mockFn } from 'jest-mock-extended';
import { GithubAuthGuard } from '../github-auth.guard';

describe('GithubAuthGuard', () => {
  const guard = new GithubAuthGuard();
  const mockSuperHandleRequest = mockFn();

  beforeAll(async () => {
    // 부모 클래스 mock 처리
    (GithubAuthGuard.prototype as any).__proto__.handleRequest = mockSuperHandleRequest;
  });

  beforeEach(async () => {
    mockSuperHandleRequest.mockClear();
    jest.clearAllTimers();
  });

  describe('handleRequest', () => {
    it('정상적인 요청은 그대로 반환한다.', async () => {
      const githubProfile = { id: 1 };
      mockSuperHandleRequest.mockReturnValue(githubProfile);

      const result = guard.handleRequest(null, null, null, null);

      expect(result).toBe(githubProfile);
      expect(mockSuperHandleRequest).toBeCalledTimes(1);
    });

    it('정상적인 요청이 아니면 BadRequestException 에러를 던진다.', async () => {
      mockSuperHandleRequest.mockImplementation(() => {
        throw new Error('error');
      });

      const act = () => guard.handleRequest(null, null, null, null);

      expect(act).toThrowError(BadRequestException);
      expect(mockSuperHandleRequest).toBeCalledTimes(1);
    });
  });
});
