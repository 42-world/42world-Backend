import { PaginationRequestDto } from '@api/pagination/dto/pagination-request.dto';
import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import axios from 'axios';
import { CookieOptions } from 'express';

export const MINUTE = 60;
export const HOUR = 60 * MINUTE;
export const TIME2LIVE = 30 * MINUTE;

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

export const getNextMonth = () => {
  const now = new Date();
  return new Date(now.setMonth(now.getMonth() + 1));
};

export const isExpired = (exp: Date): boolean => {
  const now = new Date();
  return now >= exp;
};

export const getCookieOption = (): CookieOptions => {
  if (process.env.NODE_ENV === 'alpha' || process.env.NODE_ENV === 'prod') {
    return { secure: true, sameSite: 'none' };
  }
  return {};
};

export const errorHook = async (
  exceptionName: string,
  exceptionMessage: string,
) => {
  const phase = process.env.NODE_ENV;
  const slackMessage = `[${phase}] ${exceptionName}: ${exceptionMessage}`;

  try {
    if (phase === 'prod') {
      await axios.post(process.env.SLACK_HOOK_URL, { text: slackMessage });
    }
  } catch (e) {
    console.error(e);
  }
};

export function compareRole(rule: UserRole, mine: UserRole): boolean {
  const toRoleId = (r: UserRole) => {
    switch (r) {
      case UserRole.ADMIN:
        return 3;
      case UserRole.CADET:
        return 2;
      case UserRole.NOVICE:
        return 1;
    }
  };
  return toRoleId(rule) <= toRoleId(mine);
}

export const getPaginationSkip = (paginationDto: PaginationRequestDto) => {
  return (paginationDto.page - 1) * paginationDto.take;
};
