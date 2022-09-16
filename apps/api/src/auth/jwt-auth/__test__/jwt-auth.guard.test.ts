import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { User } from '@app/entity/user/user.entity';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { mock, mockFn } from 'jest-mock-extended';
import { AuthDecoratorParam } from '../../types';
import { JwtAuthGuard } from '../jwt-auth.guard';

describe('JwtAuthGuard', () => {
  const mockRelfector = mock<Reflector>();
  const context = new ExecutionContextHost([]);
  const mockSuperCanActivate = mockFn();
  const mockSuperHandleRequest = mockFn();
  const jwtAuthGuard = new JwtAuthGuard(mockRelfector);

  beforeAll(async () => {
    // 부모 클래스 mock 처리
    (JwtAuthGuard.prototype as any).__proto__.canActivate = mockSuperCanActivate;
    (JwtAuthGuard.prototype as any).__proto__.handleRequest = mockSuperHandleRequest;
  });

  beforeEach(async () => {
    mockRelfector.get.mockClear();
    mockSuperCanActivate.mockClear();
    mockSuperHandleRequest.mockClear();
    jest.clearAllTimers();
  });

  describe('canActivate', () => {
    test('REQUIRE_ROLES 가 없으면 무조건 true 이다. ', async () => {
      mockRelfector.get.mockReturnValue(undefined);

      const result = jwtAuthGuard.canActivate(context);

      expect(result).toBe(true);
      expect(mockSuperCanActivate).toBeCalledTimes(0);
    });

    test('REQUIRE_ROLES 가 있으면 super를 호출한다.', async () => {
      mockRelfector.get.mockReturnValue(['allow'] as AuthDecoratorParam);
      mockSuperCanActivate.mockReturnValue(true);

      const result = jwtAuthGuard.canActivate(context);

      expect(result).toBe(true);
      expect(mockSuperCanActivate).toBeCalledTimes(1);
    });
  });

  describe('handleRequest', () => {
    test('allow 하는 권한이 아예 없으면 아무 권한도 통과하지 못한다.', async () => {
      mockRelfector.get.mockReturnValue(['allow'] as AuthDecoratorParam);

      const user = new User();
      user.role = UserRole.ADMIN;
      mockSuperHandleRequest.mockReturnValue(user);

      const act = () => jwtAuthGuard.handleRequest(null, null, null, context);

      expect(act).toThrowError(ForbiddenException);
      expect(mockSuperHandleRequest).toBeCalledTimes(1);
      expect(act).toThrowErrorMatchingInlineSnapshot(`"접근 권한 없음"`);
    });

    test('allow 하는 권한에 포함되어있으면 통과한다.', async () => {
      mockRelfector.get.mockReturnValue(['allow', UserRole.ADMIN] as AuthDecoratorParam);

      const user = new User();
      user.role = UserRole.ADMIN;
      mockSuperHandleRequest.mockReturnValue(user);

      const result = jwtAuthGuard.handleRequest(null, null, null, context);

      expect(result).toBe(user);
      expect(mockSuperHandleRequest).toBeCalledTimes(1);
    });

    test('allow 하는 권한에 포함되어있지 않으면 통과하지 못한다.', async () => {
      mockRelfector.get.mockReturnValue(['allow', UserRole.ADMIN] as AuthDecoratorParam);

      const user = new User();
      user.role = UserRole.GUEST;
      mockSuperHandleRequest.mockReturnValue(user);

      const act = () => jwtAuthGuard.handleRequest(null, null, null, context);

      expect(act).toThrowError(ForbiddenException);
      expect(mockSuperHandleRequest).toBeCalledTimes(1);
      expect(act).toThrowErrorMatchingInlineSnapshot(`"접근 권한 없음"`);
    });

    test('deny 하는 권한이 아예 없으면 모든 권한이 통과한다.', async () => {
      mockRelfector.get.mockReturnValue(['deny'] as AuthDecoratorParam);

      const user = new User();
      user.role = UserRole.ADMIN;
      mockSuperHandleRequest.mockReturnValue(user);

      const result = jwtAuthGuard.handleRequest(null, null, null, context);

      expect(result).toBe(user);
      expect(mockSuperHandleRequest).toBeCalledTimes(1);
    });

    test('deny 하는 권한에 포함되어있으면 통과하지 않는다.', async () => {
      mockRelfector.get.mockReturnValue(['deny', UserRole.ADMIN] as AuthDecoratorParam);

      const user = new User();
      user.role = UserRole.ADMIN;
      mockSuperHandleRequest.mockReturnValue(user);

      const act = () => jwtAuthGuard.handleRequest(null, null, null, context);

      expect(act).toThrowError(ForbiddenException);
      expect(mockSuperHandleRequest).toBeCalledTimes(1);
      expect(act).toThrowErrorMatchingInlineSnapshot(`"접근 권한 없음"`);
    });

    test('deny 하는 권한에 포함되어있지 않으면 통과한다.', async () => {
      mockRelfector.get.mockReturnValue(['deny', UserRole.GUEST] as AuthDecoratorParam);

      const user = new User();
      user.role = UserRole.ADMIN;
      mockSuperHandleRequest.mockReturnValue(user);

      const result = jwtAuthGuard.handleRequest(null, null, null, context);

      expect(result).toBe(user);
      expect(mockSuperHandleRequest).toBeCalledTimes(1);
    });

    test('jwt 토큰이 유효하지 않을때, GUEST 권한이 허락되면 GUEST로 처리한다.', async () => {
      mockRelfector.get.mockReturnValue(['allow', UserRole.GUEST] as AuthDecoratorParam);

      // jwt 토큰이 유효하지 않을때 에러를 던짐.
      mockSuperHandleRequest.mockImplementation(() => {
        throw new UnauthorizedException();
      });

      const result = jwtAuthGuard.handleRequest(null, null, null, context) as User;

      expect(result.id).toBe(-1);
      expect(result.role).toBe(UserRole.GUEST);
      expect(mockSuperHandleRequest).toBeCalledTimes(1);
    });

    test('jwt 토큰이 유효하지 않을때, GUEST 권한도 허락되지 않으면 통과하지 못한다.', async () => {
      mockRelfector.get.mockReturnValue(['deny', UserRole.GUEST] as AuthDecoratorParam);

      // jwt 토큰이 유효하지 않을때 에러를 던짐.
      mockSuperHandleRequest.mockImplementation(() => {
        throw new UnauthorizedException();
      });

      const act = () => jwtAuthGuard.handleRequest(null, null, null, context) as User;

      expect(act).toThrowError(UnauthorizedException);
      expect(mockSuperHandleRequest).toBeCalledTimes(1);
      expect(act).toThrowErrorMatchingInlineSnapshot(`"Unauthorized"`);
    });
  });
});
