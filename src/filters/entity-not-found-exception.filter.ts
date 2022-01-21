import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { Response } from 'express';

const FIND_DOUBLE_QUOTE = /\"/g;

/**
 * Custom exception filter to convert EntityNotFoundError from TypeOrm to NestJs responses
 * @see also @https://docs.nestjs.com/exception-filters
 */
@Catch(EntityNotFoundError)
export class EntityNotFoundExceptionFilter implements ExceptionFilter {
  public catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    return response.status(404).json({
      message: {
        statusCode: 404,
        message: exception.message.replace(FIND_DOUBLE_QUOTE, ''),
      },
    });
  }
}
