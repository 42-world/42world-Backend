import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { INTERNAL_ERROR_MESSAGE } from '@root/filters/constant';
import { errorHook } from '@root/utils';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: { stack: string; message: string }, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    console.error(exception);
    errorHook('Unknown Error', exception.message);

    return response.status(500).json({
      message: {
        statusCode: 500,
        message: INTERNAL_ERROR_MESSAGE,
      },
    });
  }
}
