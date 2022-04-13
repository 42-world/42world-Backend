import { Public } from '@api/auth/auth.decorator';
import { logger } from '@app/utils/logger';
import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

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
