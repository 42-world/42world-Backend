import { Controller, Get, Query } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('')
  async test(@Query('nickname') nickname: string) {
    await this.mailService.signin(`${nickname}@student.42seoul.kr`);
    return 'done';
  }
}
