import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';

/**
 * @description Param Decorator를 테스트하기 위한 헬퍼 함수
 *
 * @example
 * ```
 * const result = getParamDecorator(AuthUser)('id', context)
 * ```
 *
 * @see https://github.com/nestjs/nest/issues/1020
 * @see https://github.com/EnricoFerro/test-NestJs7-Decorator/blob/master/src/app.controller.spec.ts
 */
export function getParamDecorator(decorator: Function) {
  class Test {
    public test(@decorator() value: unknown) {}
  }

  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'test');
  return args[Object.keys(args)[0]].factory;
}
