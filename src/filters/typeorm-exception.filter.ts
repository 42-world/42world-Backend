import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { TypeORMError } from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import axios from 'axios';

const FIND_DOUBLE_QUOTE = /\"/g;

@Catch(TypeORMError)
export class TypeormExceptionFilter implements ExceptionFilter {
  public catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const PHASE = process.env.NODE_ENV;
    const slackMessage = `[${PHASE}] ${exception.name}: ${exception.message}}`;

    axios.post(
      'https://hooks.slack.com/services/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',
      { text: slackMessage },
    );

    console.error(exception);

    if (exception instanceof EntityNotFoundError) {
      return response.status(404).json({
        message: {
          statusCode: 404,
          message: exception.message.replace(FIND_DOUBLE_QUOTE, ''),
        },
      });
    }

    return response.status(500).json({
      message: {
        statusCode: 500,
        message: 'Something Went Wrong',
      },
    });
  }
}
