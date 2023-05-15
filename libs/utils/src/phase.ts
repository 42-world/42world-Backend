export type Phase = 'dev' | 'alpha' | 'prod' | 'test';

export const PHASE: Phase =
  process.env.PHASE === 'prod' //
    ? 'prod'
    : process.env.PHASE === 'alpha'
    ? 'alpha'
    : process.env.PHASE === 'test'
    ? 'test'
    : 'dev';
