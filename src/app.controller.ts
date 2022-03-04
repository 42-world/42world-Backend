import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@auth/auth.decorator';
import { logger } from './config/logger';

@ApiTags('Hello')
@Controller()
export class AppController {
  @Get()
  @Public()
  @ApiOperation({ summary: 'Hello world!' })
  @ApiOkResponse({ description: 'Hello world!' })
  getHello(): string {
    logger.info('Hello World!');
    return 'Hello World!';
  }
}
