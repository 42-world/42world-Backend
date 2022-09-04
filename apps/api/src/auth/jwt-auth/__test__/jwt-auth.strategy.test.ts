import { UserService } from '@api/user/user.service';
import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { User } from '@app/entity/user/user.entity';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mock, mockFn } from 'jest-mock-extended';
import { JWTPayload } from '../../types';
import { getAccessToken, JwtAuthStrategy } from '../jwt-auth.strategy';

describe('JwtAuthStrategy', () => {
  const mockConfigService = mock<ConfigService>({
    get: mockFn().mockReturnValue('test'),
  });
  const mockUserService = mock<UserService>();
  const jwtAuthStrategy = new JwtAuthStrategy(mockUserService, mockConfigService);
  const payload: JWTPayload = {
    userId: 1,
    userRole: UserRole.GUEST,
  };

  beforeEach(() => {
    mockUserService.findOneByIdOrFail.mockClear();
    jest.clearAllTimers();
  });

  describe('validate', () => {
    it('유저가 존재하면 유저를 반환한다', async () => {
      const user = new User();
      mockUserService.findOneByIdOrFail.mockResolvedValue(user);

      const result = await jwtAuthStrategy.validate(payload);

      expect(result).toBe(user);
      expect(mockUserService.findOneByIdOrFail).toBeCalledTimes(1);
    });

    it('유저가 없으면 UnauthorizedException 에러를 던진다', async () => {
      mockUserService.findOneByIdOrFail.mockRejectedValue(new NotFoundException());

      const act = async () => await jwtAuthStrategy.validate(payload);

      expect(act).rejects.toThrowError(UnauthorizedException);
      expect(mockUserService.findOneByIdOrFail).toBeCalledTimes(1);
    });

    it('에러가 나면 에러를 던진다', async () => {
      mockUserService.findOneByIdOrFail.mockRejectedValue(new Error());

      const act = async () => await jwtAuthStrategy.validate(payload);

      expect(act).rejects.toThrowError(Error);
      expect(mockUserService.findOneByIdOrFail).toBeCalledTimes(1);
    });
  });

  describe('getAccessToken', () => {
    it('쿠키에서 ACCESS_TOKEN_KEY를 반환한다', () => {
      const request = {
        cookies: {
          ACCESS_TOKEN_KEY: 'test',
        },
      };

      const result = getAccessToken('ACCESS_TOKEN_KEY', request);

      expect(result).toBe('test');
    });
  });
});
