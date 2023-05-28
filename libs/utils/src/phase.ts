export type Phase = 'dev' | 'alpha' | 'staging' | 'prod' | 'test';

export const PHASE: Phase =
  process.env.PHASE === 'prod' //
    ? 'prod'
    : process.env.PHASE === 'staging'
    ? 'staging'
    : process.env.PHASE === 'alpha'
    ? 'alpha'
    : process.env.PHASE === 'test'
    ? 'test'
    : 'dev';
