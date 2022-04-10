import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { errorHook } from '@api/utils';
import { INTERNAL_ERROR_MESSAGE } from './filters.constant';

@Catch(InternalServerErrorException)
export class InternalServerErrorExceptionFilter implements ExceptionFilter {
  public catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

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
