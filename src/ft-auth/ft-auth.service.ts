import { UserService } from '@user/user.service';
import {
  BadRequestException,
  CACHE_MANAGER,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FtAuth } from './entities/ft-auth.entity';
import { Cache } from 'cache-manager';

import { MailerService } from '@nestjs-modules/mailer';
import { getEmail, getCode, TITLE, TIME2LIVE } from './ft-auth.utils';

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

  async signin(intraId: string, userId: number) {
    const user = await this.userService.getOne(userId);
    if (user.isAuthenticated) {
      throw new ForbiddenException('이미 인증된 사용자입니다.');
    }
    const email = getEmail(intraId);
    const code = await getCode(intraId);
    await this.cacheManager.set<number>(code, userId, { ttl: TIME2LIVE });
    await this._send([email], `${TITLE}`, 'signin.ejs', {
      nickname: intraId,
      code: code,
      endpoint: `${process.env.EMAIL_ENDPOINT}`,
    });
  }

  async getAuth(code: string) {
    const userId = await this.cacheManager.get<number>(code);
    if (!userId) {
      throw new ForbiddenException('유효하지 않은 code 입니다.');
    }
    const user = await this.userService.getOne(userId);
    if (!user || user.deletedAt) {
      throw new BadRequestException('존재하지 않는 사용자입니다.');
    }
    await this.userService.updateAuthenticate(user, { isAuthenticated: true });
    this.cacheManager.del(code);
  }
}
