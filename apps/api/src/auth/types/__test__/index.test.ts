import * as Types from '../index';

/**
 * @description test coverage 때문에 넣음
 * @see https://stackoverflow.com/questions/67388165/how-to-get-jest-to-have-coverage-for-export-only-lines
 */
describe('Types', () => {
  it('should have exports', () => {
    expect(typeof Types).toBe('object');
  });

  it('should not have undefined exports', () => {
    Object.keys(Types).forEach((exportKey) => expect(Boolean(Types[exportKey])).toBe(true));
  });
});
