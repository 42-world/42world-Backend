import { logger } from '@app/utils/logger';
import { errorHook } from '@app/utils/utils';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

const FIND_DOUBLE_QUOTE = /\"/g;

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  public catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof EntityNotFoundError) {
      const message = exception.message.replace(FIND_DOUBLE_QUOTE, '');
      exception = new NotFoundException(message);
    } else if (!(exception instanceof HttpException)) {
      logger.error(`${request.url} ${exception.name} ${exception.message}`);
      errorHook(exception.name, exception.message, this.configService.get('SLACK_HOOK_URL'));
      exception = new InternalServerErrorException('Unknown Error');
    }

    return response.status((exception as HttpException).getStatus()).json((exception as HttpException).getResponse());
  }
}
