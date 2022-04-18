import { HOUR, MINUTE } from '@app/utils/utils';

export const GAEPO = 'gaepo';
export const SEOCHO = 'seocho';

export const FT_CHECKIN_CACHE_TTL = MINUTE * 30;
export const FT_CHECKIN_BASE_URL = 'https://api.checkin.42seoul.io';
export const FT_CHECKIN_END_POINT = `${FT_CHECKIN_BASE_URL}/user/using`;

export const MAX_CHECKIN_CACHE_TTL = HOUR * 48;
export const MAX_CHECKIN_END_POINT = `${FT_CHECKIN_BASE_URL}/config`;
