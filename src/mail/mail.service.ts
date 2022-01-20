import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcryptjs';

const title = '[42WORLD] 이메일 인증을 완료하세요';
const getNickname = (email: string) => email.split('@')[0];
const getSaltNum = (now: number) => {
  let sum = 0;
  while (now > 0) {
    sum += now % 10;
    now = Math.floor(now / 42);
    console.log(now);
  }
  return sum;
};

const getCode = async (nickname: string) => {
  const now = new Date().getMilliseconds();
  const salt_rounds = getSaltNum(now);
  const salt = await bcrypt.genSalt(salt_rounds);
  const code = encodeURIComponent(bcrypt.hashSync(nickname, salt));
  console.log(code);
  return code;
};

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async _send(
    tos: string[],
    subject: string,
    templateName: string,
    context: any = {},
  ): Promise<boolean> {
    await this.mailerService.sendMail({
      to: tos.join(', '),
      subject,
      template: `${templateName}`,
      context,
    });

    return true;
  }

  async signin(to: string) {
    await this._send([to], `${title}`, 'signin.ejs', {
      nickname: getNickname(to),
      code: await getCode(getNickname(to)),
    });
  }
}
