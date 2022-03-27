import * as request from 'supertest';

function expectErrorMessage(
  message: string | string[],
  response: request.Response,
) {
  if (message instanceof Array) {
    expect(response.body.message).toEqual(expect.arrayContaining(message));
  } else {
    expect(response.body.message).toEqual(message);
  }
}

export class ValidateTester<T> {
  constructor(
    public readonly testName: string,
    public readonly buildDto: (normalDto: T) => Partial<T>,
    public readonly expectErrorResponse: (response: request.Response) => void,
  ) {}
}

export function buildValidateTest<T>(
  key: keyof T,
  buildTests: Array<<T>(key: keyof T) => ValidateTester<T>>,
): Array<[string, ValidateTester<T>]> {
  return buildTests.map((buildTest) => {
    const test: ValidateTester<T> = buildTest<T>(key);

    return [`${test.testName}`, test];
  });
}

export function 값이_없는_경우(param?: {
  message: string | string[];
}): <T>(key: keyof T) => ValidateTester<T> {
  return <T>(key: keyof T) => {
    const name = `${key} 값이 없을 때`;
    const buildDto = (dto: T) => ({
      ...dto,
      [key]: undefined,
    });
    const expectErrorResponse = (response: request.Response) => {
      expect(response.status).toBe(400);
      if (param) {
        expectErrorMessage(param.message, response);
      } else {
        expectErrorMessage([`${key} should not be empty`], response);
      }
    };

    return new ValidateTester<T>(name, buildDto, expectErrorResponse);
  };
}

export function 잘못된_값을_입력한_경우(param: {
  detail: string;
  wrongValue: any;
  message: string | string[];
}): <T>(key: keyof T) => ValidateTester<T> {
  return <T>(key: keyof T) => {
    const testName = `${key} 값이 ${param.detail} 일 때`;
    const buildDto = (dto: T) => ({
      ...dto,
      [key]: param.wrongValue,
    });
    const expectErrorResponse = (response: request.Response) => {
      expect(response.status).toBe(400);
      expectErrorMessage(param.message, response);
    };

    return new ValidateTester(testName, buildDto, expectErrorResponse);
  };
}

export function 타입이_틀린_경우(param: {
  wrongValue: any;
  message: string | string[];
}): <T>(key: keyof T) => ValidateTester<T> {
  return <T>(key: keyof T) => {
    const testName = `${key} 타입이 틀렸을때 (${param.wrongValue} 입력됨)`;
    const buildDto = (dto: T) => ({
      ...dto,
      [key]: param.wrongValue,
    });
    const expectErrorResponse = (response: request.Response) => {
      expect(response.status).toBe(400);
      expectErrorMessage(param.message, response);
    };

    return new ValidateTester(testName, buildDto, expectErrorResponse);
  };
}

export function 엔티티가_없는_경우(param: {
  notExistEntityId: number;
}): <T>(key: keyof T) => ValidateTester<T> {
  return <T>(key: keyof T) => {
    const testName = `${key} 엔티티가 없는 경우 (${param.notExistEntityId} 입력됨)`;
    const buildDto = (dto: T) => ({
      ...dto,
      [key]: param.notExistEntityId,
    });
    const expectErrorResponse = (response: request.Response) => {
      expect(response.status).toBe(404);
    };

    return new ValidateTester(testName, buildDto, expectErrorResponse);
  };
}
