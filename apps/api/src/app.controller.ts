import { logger } from '@app/utils/logger';
import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Hello')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Hello world!' })
  @ApiOkResponse({ description: 'Hello world!' })
  getHello(): string {
    logger.info('Hello World!!');
    return 'Hello World!';
  }

  @Get('/error')
  getError(): void {
    throw new Error('Hi Sentry!');
  }
}
