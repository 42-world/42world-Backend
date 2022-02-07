import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { INTERNAL_ERROR_MESSAGE } from '@root/filters/constant';
import { errorHook } from '@root/utils';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(
    exception: { stack: string; message: string },
    host: ArgumentsHost,
  ): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: httpStatus,
      message: INTERNAL_ERROR_MESSAGE,
    };

    console.error(exception);
    errorHook('Unknown Error', exception.message);

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
