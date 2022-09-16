import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { User } from '@app/entity/user/user.entity';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import 'reflect-metadata';
import { Auth, AuthUser, ReqGithubProfile } from '../auth.decorator';
import { REQUIRE_ROLES } from '../constant';
import { getParamDecorator } from './getParamDecoratorFactory';

describe('AuthDecorator', () => {
  describe('Auth', () => {
    test('Auth를 사용하지 않으면 권한이 설정이 되지 않는다.', async () => {
      class TestClass {
        testMethod() {}
      }

      const result = Reflect.getMetadata(REQUIRE_ROLES, new TestClass().testMethod);

      expect(result).toBeUndefined();
    });

    test(`Auth('allow', UserRole.GUEST, UserRole.ADMIN) 는 GUEST, ADMIN 둘다 허락한다`, async () => {
      class TestClass {
        @Auth('allow', UserRole.GUEST, UserRole.ADMIN)
        testMethod() {}
      }

      const result = Reflect.getMetadata(REQUIRE_ROLES, new TestClass().testMethod);

      expect(result).toStrictEqual(['allow', UserRole.GUEST, UserRole.ADMIN]);
    });

    test(`Auth('allow') 는 아무권한도 허락하지 않는다.`, async () => {
      class TestClass {
        @Auth('allow')
        testMethod() {}
      }

      const result = Reflect.getMetadata(REQUIRE_ROLES, new TestClass().testMethod);

      expect(result).toStrictEqual(['allow']);
    });

    test(`Auth('deny', UserRole.GUEST, UserRole.ADMIN) 는 GUEST, ADMIN 둘다 허락한다`, async () => {
      class TestClass {
        @Auth('deny', UserRole.GUEST, UserRole.ADMIN)
        testMethod() {}
      }

      const result = Reflect.getMetadata(REQUIRE_ROLES, new TestClass().testMethod);

      expect(result).toStrictEqual(['deny', UserRole.GUEST, UserRole.ADMIN]);
    });

    test(`Auth('deny') 는 모든 권한을 허락한다.`, async () => {
      class TestClass {
        @Auth('deny')
        testMethod() {}
      }

      const result = Reflect.getMetadata(REQUIRE_ROLES, new TestClass().testMethod);

      expect(result).toStrictEqual(['deny']);
    });

    test(`Auth('public') 은 모든 권한을 허락한다.`, async () => {
      class TestClass {
        @Auth('public')
        testMethod() {}
      }

      const result = Reflect.getMetadata(REQUIRE_ROLES, new TestClass().testMethod);

      expect(result).toStrictEqual(['deny']);
    });

    test(`Auth() 은 GUEST를 제외한 권한을 허락한다.`, async () => {
      class TestClass {
        @Auth()
        testMethod() {}
      }

      const result = Reflect.getMetadata(REQUIRE_ROLES, new TestClass().testMethod);

      expect(result).toStrictEqual(['deny', UserRole.GUEST]);
    });
  });

  describe('AuthUser', () => {
    test('Request 에 담긴 user를 가져온다', async () => {
      const user = new User();
      const context = new ExecutionContextHost([{ user }, {}]);

      const result = getParamDecorator(AuthUser)(null, context);

      expect(result).toStrictEqual(user);
    });

    test('Request 에 담긴 user의 id를 가져온다', async () => {
      const user = new User();
      user.id = 1;
      const context = new ExecutionContextHost([{ user }, {}]);

      const result = getParamDecorator(AuthUser)('id', context);

      expect(result).toStrictEqual(user.id);
    });

    test('Request 에 담긴 user의 id가 없는경우', async () => {
      const user = new User();
      const context = new ExecutionContextHost([{ user }, {}]);

      const result = getParamDecorator(AuthUser)('id', context);

      expect(result).toBeUndefined();
    });
  });

  describe('ReqGithubProfile', () => {
    test('Request 에 담긴 githubprofile를 가져온다', async () => {
      const user = { id: 1, username: 'test' };
      const context = new ExecutionContextHost([{ user }, {}]);

      const result = getParamDecorator(ReqGithubProfile)(null, context);

      expect(result).toStrictEqual(user);
    });
  });
});
