import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { TypeORMError } from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { errorHook } from '@root/utils';

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

    errorHook(exception.name, exception.message);
    console.error(exception);

    return response.status(500).json({
      message: {
        statusCode: 500,
        message: 'Something Went Wrong',
      },
    });
  }
}
