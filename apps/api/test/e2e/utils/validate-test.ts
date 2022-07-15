export function testDto<T>(testDtos: Array<[keyof T, any, string?]>) {
  const tests: Array<[string, (normalDto: T) => Partial<T>]> = testDtos.map(([key, value, detail]) => {
    const buildDto = (dto: T) => ({
      ...dto,
      [key]: value,
    });

    return [`${key} 값이 ${detail ?? value}`, buildDto];
  });

  return test.each(tests);
}
