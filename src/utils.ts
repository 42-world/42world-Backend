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
  if (process.env.NODE_ENV === 'test') return 'config/test.env';
  if (process.env.NODE_ENV === 'dev') return 'config/dev.env';
  if (process.env.NODE_ENV === 'alpha') return 'config/alpha.env';
  if (process.env.NODE_ENV === 'prod') return 'config/prod.env';
  return 'config/dev.env';
};
