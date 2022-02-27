import { UserService } from '@user/user.service';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MailerService } from '@nestjs-modules/mailer';
import { getEmail, getCode, TITLE } from './intra-auth.utils';
import { User, UserRole } from '@root/user/entities/user.entity';
import { IntraAuthMailDto } from '@cache/dto/intra-auth.dto';
import { IntraAuth } from '@intra-auth/entities/intra-auth.entity';
import { CacheService } from '@cache/cache.service';
import {
  SIGNIN_ALREADY_AUTH_ERROR_MESSAGE,
  SIGNIN_ALREADY_EXIST_ERROR_MESSAGE,
} from '@intra-auth/constant';

@Injectable()
export class IntraAuthService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
    private readonly cacheService: CacheService,

    @InjectRepository(IntraAuth)
    private readonly intraAuthRepository: Repository<IntraAuth>,
  ) {}

  async _send(
    tos: string[],
    subject: string,
    templateName: string,
    context: any = {},
  ): Promise<boolean | never> {
    try {
      await this.mailerService.sendMail({
        to: tos.join(', '),
        subject,
        template: `${templateName}`,
        context,
      });
    } catch (e: any) {
      throw new InternalServerErrorException(e);
    }
    return true;
  }

  async signin(intraId: string, user: User) {
    if (user.role !== UserRole.NOVICE) {
      throw new ForbiddenException(SIGNIN_ALREADY_AUTH_ERROR_MESSAGE);
    }

    const cadet = await this.intraAuthRepository.findOne({ intraId: intraId });

    if (cadet) {
      throw new ForbiddenException(SIGNIN_ALREADY_EXIST_ERROR_MESSAGE);
    }

    const email = getEmail(intraId);
    const code = await getCode(intraId);
    const intraAuthMailDto = new IntraAuthMailDto(user.id, intraId);

    await this.cacheService.setIntraAuthMailData(code, intraAuthMailDto);

    await this._send([email], `${TITLE}`, 'signin.ejs', {
      nickname: intraId,
      code: code,
      endpoint: `${process.env.EMAIL_ENDPOINT}`,
      github: user.nickname,
    });
  }

  async getAuth(code: string) {
    const intraAuthMailDto = await this.cacheService.getIntraAuthMailData(code);

    if (!intraAuthMailDto) {
      throw new ForbiddenException('존재하지 않는 토큰입니다.');
    }

    const cadet = await this.intraAuthRepository.findOne({
      intraId: intraAuthMailDto.intraId,
    });

    if (cadet) {
      throw new ForbiddenException('이미 가입된 카뎃입니다.');
    }

    const user = await this.userService.getOne(intraAuthMailDto.userId);

    await this.userService.updateIntraAuth(user, {
      role: UserRole.CADET,
      nickname: intraAuthMailDto.intraId,
    });
    await this.intraAuthRepository.save({
      intraId: intraAuthMailDto.intraId,
      userId: intraAuthMailDto.userId,
    });
    this.cacheService.del(code);
  }
}
