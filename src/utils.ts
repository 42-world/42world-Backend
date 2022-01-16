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
