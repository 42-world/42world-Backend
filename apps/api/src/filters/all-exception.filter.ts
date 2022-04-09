import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { INTERNAL_ERROR_MESSAGE } from '@api/filters/constant';
import { errorHook } from '@api/utils';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: { stack: string; message: string }, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    errorHook('Unknown Error', exception.message);

    return response.status(500).json({
      message: {
        statusCode: 500,
        message: INTERNAL_ERROR_MESSAGE,
      },
    });
  }
}
