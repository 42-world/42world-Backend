import { MailService } from './../mail/mail.service';
import { Body, Controller, Post } from '@nestjs/common';
import { FtAuthService } from './ft-auth.service';
import { CreateFtAuthDto } from './dto/create-ft-auth.dto';
import { UpdateAuthenticateDto } from './dto/update-authenticate.dto';
import { Public } from '@root/auth/auth.decorator';

@Controller('ft-auth')
export class FtAuthController {
  constructor(
    private readonly ftAuthService: FtAuthService,
    private readonly mailService: MailService,
  ) {}

  @Public()
  @Post()
  sendMail(@Body('nickname') nickname: string) {
    this.mailService.signin(nickname);
  }
}
