import { Controller, Get, HttpCode } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiCookieAuth()
@ApiUnauthorizedResponse({ description: '인증 실패' })
@ApiTags('Search')
@Controller('search')
export class SearchController {
  @Get()
  @HttpCode(200)
  async searchAll(): Promise<[]> {
    console.log('GET /search');

    return [];
  }
}
