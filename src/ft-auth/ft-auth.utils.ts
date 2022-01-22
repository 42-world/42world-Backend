import * as bcrypt from 'bcryptjs';

export const TITLE = '[42WORLD] 이메일 인증을 완료하세요';
export const EMAIL = 'student.42seoul.kr';
const MINUTE = 60;
export const TIME2LIVE = 30 * MINUTE;

export const getNickname = (email: string) => email.split('@')[0];
export const getEmail = (nickname: string) => `${nickname}@${EMAIL}`;
export const getSaltNum = (now: number) => {
  let sum = 0;
  while (now > 0) {
    sum += now % 10;
    now = Math.floor(now / 42);
    console.log(now);
  }
  return sum;
};

export const getCode = async (nickname: string) => {
  const now = new Date().getMilliseconds();
  const salt_rounds = getSaltNum(now);
  const salt = await bcrypt.genSalt(salt_rounds);
  /* prettier-ignore */
  const code = encodeURIComponent(bcrypt.hashSync(nickname, salt)).split('.')[1];
  return code;
};
