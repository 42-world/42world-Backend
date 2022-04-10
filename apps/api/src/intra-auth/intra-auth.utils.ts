import * as crypto from 'crypto';
import { EMAIL } from './intra-auth.constant';

export const getNickname = (email: string) => email.split('@')[0];

export const getEmail = (nickname: string) => `${nickname}@${EMAIL}`;

export const getCode = async (nickname: string) => {
  const code = crypto
    .createHash('sha1')
    .update(nickname + new Date())
    .digest('hex');
  return code;
};
