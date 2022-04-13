import { logger } from '@app/utils/logger';
import { errorHook } from '@app/utils/utils';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { INTERNAL_ERROR_MESSAGE } from './filters.constant';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: { stack: string; message: string }, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    logger.error(exception.message);
    errorHook('Unknown Error', exception.message);

    return response.status(500).json({
      message: {
        statusCode: 500,
        message: INTERNAL_ERROR_MESSAGE,
      },
    });
  }
}
