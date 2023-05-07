export const PHASE = process.env.PHASE;

if (!PHASE) {
  throw new Error('PHASE is not defined');
}
