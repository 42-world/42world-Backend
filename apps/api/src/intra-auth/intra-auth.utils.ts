import * as crypto from 'crypto';

export const TITLE = '[42WORLD] 이메일 인증을 완료하세요';
export const EMAIL = 'student.42seoul.kr';

export const getNickname = (email: string) => email.split('@')[0];
export const getEmail = (nickname: string) => `${nickname}@${EMAIL}`;

export const getCode = async (nickname: string) => {
  const code = crypto
    .createHash('sha1')
    .update(nickname + new Date())
    .digest('hex');
  return code;
};
