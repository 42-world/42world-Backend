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
import { User } from '@root/user/entities/user.entity';
import { FtAuthRedisValue } from './interfaces/ft-auth.interface';

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

  async signin(intraId: string, user: User) {
    if (user.isAuthenticated) {
      throw new ForbiddenException('이미 인증된 사용자입니다.');
    }

    const email = getEmail(intraId);
    const code = await getCode(intraId);
    const value = { userId: user.id, intraId };

    await this.cacheManager.set<FtAuthRedisValue>(code, value, {
      ttl: TIME2LIVE,
    });
    await this._send([email], `${TITLE}`, 'signin.ejs', {
      nickname: intraId,
      code: code,
      endpoint: `${process.env.EMAIL_ENDPOINT}`,
      github: user.nickname,
    });
  }

  async getAuth(code: string) {
    const ftAuth = await this.cacheManager.get<FtAuthRedisValue>(
      decodeURIComponent(code),
    );
    if (!ftAuth) {
      throw new ForbiddenException('존재하지 않는 토큰입니다.');
    }

    const user = await this.userService.getOne(ftAuth.userId);

    await this.userService.updateAuthenticate(user, { isAuthenticated: true });
    await this.ftAuthRepository.save({
      userId: user.id,
      intraId: ftAuth.intraId,
    });
    this.cacheManager.del(code);
  }
}
