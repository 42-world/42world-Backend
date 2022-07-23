import * as crypto from 'crypto';

export const getNickname = (email: string) => email.split('@')[0];

export const getCode = async (nickname: string) => {
  const code = crypto
    .createHash('sha1')
    .update(nickname + new Date())
    .digest('hex');
  return code;
};
