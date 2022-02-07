import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { errorHook } from '@root/utils';

@Catch(InternalServerErrorException)
export class InternalServerErrorExceptionFilter implements ExceptionFilter {
  public catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    errorHook(exception.name, exception.message);

    return response.status(500).json({
      message: {
        statusCode: 500,
        message: 'Something Went Wrong',
      },
    });
  }
}
