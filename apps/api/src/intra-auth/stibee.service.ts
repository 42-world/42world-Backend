import axios from 'axios';
import MailService from './mail.service';

export default class StibeeService implements MailService {
  constructor() {}

  async send(templateUri: string, name: string, code: string, githubId: string) {
    await this.subscribe(name);

    await axios.post(templateUri, {
      subscriber: `${name}@student.42seoul.kr`,
      name,
      code,
      githubId,
    });
  }

  private async subscribe(name: string) {
    await axios.post(process.env.STIBEE_SUBSCRIBE_URL, {
      subscribers: [
        {
          email: `${name}@student.42seoul.kr`,
          name,
        },
      ],
    });
  }

  async unsubscribe(name: string) {
    await axios.delete(process.env.STIBEE_SUBSCRIBE_URL, {
      data: [`${name}@student.42seoul.kr`],
    });
  }
}
