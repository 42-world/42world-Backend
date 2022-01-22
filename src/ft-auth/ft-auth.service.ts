import { UserService } from '@user/user.service';
import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FtAuth } from './entities/ft-auth.entity';
import { Cache } from 'cache-manager';

import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcryptjs';

const TITLE = '[42WORLD] 이메일 인증을 완료하세요';
const EMAIL = 'student.42seoul.kr';
const TIME2LIVE = 86400;
const getNickname = (email: string) => email.split('@')[0];
const getEmail = (nickname: string) => `${nickname}@${EMAIL}`;
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
  return code;
};

@Injectable()
export class FtAuthService {
  constructor(
    @InjectRepository(FtAuth)
    private readonly ftAuthRepository: Repository<FtAuth>,
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

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

  async signin(nickname: string, userId: number) {
    const email = getEmail(nickname);
    const code = await getCode(nickname);
    await this.cacheManager.set<number>(code, userId, { ttl: TIME2LIVE });
    await this._send([email], `${TITLE}`, 'signin.ejs', {
      nickname: nickname,
      code: code,
      endpoint: `http://localhost:8888/ft-auth/babo`,
    });
  }

  async getAuth(code: string) {
    const userId = await this.cacheManager.get<number>(code);
    const user = await this.userService.getOne(userId);
    user.isAuthenticated = true;
    await this.userService.update(user);
    this.cacheManager.del(code);
  }
}
