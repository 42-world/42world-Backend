import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { TypeORMError } from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { errorHook } from '@api/utils';
import { INTERNAL_ERROR_MESSAGE } from './filters.constant';

const FIND_DOUBLE_QUOTE = /\"/g;

@Catch(TypeORMError)
export class TypeormExceptionFilter implements ExceptionFilter {
  public catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof EntityNotFoundError) {
      return response.status(404).json({
        message: {
          statusCode: 404,
          message: exception.message.replace(FIND_DOUBLE_QUOTE, ''),
        },
      });
    }

    console.error(exception);
    errorHook(exception.name, exception.message);

    return response.status(500).json({
      message: {
        statusCode: 500,
        message: INTERNAL_ERROR_MESSAGE,
      },
    });
  }
}
