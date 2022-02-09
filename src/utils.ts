import { CookieOptions } from 'express';
import axios from 'axios';

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

export const getEnvPath = () => {
  if (process.env.NODE_ENV === 'test') return 'config/.env.test';
  if (process.env.NODE_ENV === 'dev') return 'config/.env.dev';
  if (process.env.NODE_ENV === 'alpha') return 'config/.env.alpha';
  if (process.env.NODE_ENV === 'prod') return 'config/.env.prod';
  return 'config/.env.dev';
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
  const PHASE = process.env.NODE_ENV;
  const slackMessage = `[${PHASE}] ${exceptionName}: ${exceptionMessage}`;

  try {
    await axios.post(process.env.SLACK_HOOK_URL, { text: slackMessage });
  } catch (e) {
    console.error(e);
  }
};
