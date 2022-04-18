import { Public } from '@api/auth/auth.decorator';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { SlackService } from './slack.service';

@Controller('slack')
export class SlackController {
  constructor(private readonly slackService: SlackService) {}

  @Get()
  @Public()
  challenge(@Body('challenge') challenge: string): string {
    return challenge;
  }

  @Post()
  @Public()
  event(@Body() payload: string): void {
    console.log(payload);
  }
}
