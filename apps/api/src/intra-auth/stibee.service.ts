import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { EMAIL } from './intra-auth.constant';
import MailService from './mail.service';
import UnsubscribeStibeeService from './unsubscribe-stibee.service';
@Injectable()
export default class StibeeService implements MailService, UnsubscribeStibeeService {
  constructor(private readonly configService: ConfigService) {}

  private accessToken = this.configService.get<string>('STIBEE_API_KEY');

  async send(name: string, code: string, githubId: string) {
    await this.subscribe(name);
    const url = this.configService.get('STIBEE_MAIL_SEND_URL');

    try {
      await axios.post(
        url,
        {
          subscriber: `${name}@${EMAIL}`,
          name,
          code,
          githubId,
        },
        { headers: { AccessToken: this.accessToken } },
      );
    } catch (err: any) {
      this.printError(err);
      throw new InternalServerErrorException('이메일 전송 실패');
    }
  }

  private async subscribe(name: string) {
    const url = this.configService.get('STIBEE_SUBSCRIBE_URL');

    try {
      await axios.post(
        url,
        {
          subscribers: [
            {
              email: `${name}@student.42seoul.kr`,
              name,
            },
          ],
        },
        { headers: { AccessToken: this.accessToken } },
      );
    } catch (err) {
      this.printError(err);
      throw new InternalServerErrorException('스티비 구독 실패');
    }
  }

  async unsubscribe(name: string) {
    const url = this.configService.get('STIBEE_SUBSCRIBE_URL');
    try {
      await axios.delete(url, {
        data: [`${name}@student.42seoul.kr`],
        headers: { AccessToken: this.accessToken },
      });
    } catch (err) {
      this.printError(err);
      throw new InternalServerErrorException('스티비 구독 해지 실패');
    }
  }

  private printError(err: any) {
    console.error({ status: err.response.status, message: err.response.data });
    console.trace();
  }
}
