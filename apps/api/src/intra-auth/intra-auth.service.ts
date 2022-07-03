import {
  CADET_ALREADY_EXIST_ERROR_MESSAGE,
  NOT_EXIST_TOKEN_ERROR_MESSAGE,
  SIGNIN_ALREADY_AUTH_ERROR_MESSAGE,
  TITLE,
} from '@api/intra-auth/intra-auth.constant';
import { UserService } from '@api/user/user.service';
import { CacheService } from '@app/common/cache/cache.service';
import { IntraAuthMailDto } from '@app/common/cache/dto/intra-auth.dto';
import { IntraAuth } from '@app/entity/intra-auth/intra-auth.entity';
import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { User } from '@app/entity/user/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getCode, getEmail } from './intra-auth.utils';

@Injectable()
export class IntraAuthService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
    private readonly cacheService: CacheService,

    @InjectRepository(IntraAuth)
    private readonly intraAuthRepository: Repository<IntraAuth>,
  ) {}

  async _send(tos: string[], subject: string, templateName: string, context: any = {}): Promise<boolean | never> {
    try {
      await this.mailerService.sendMail({
        to: tos.join(', '),
        subject,
        template: `${templateName}`,
        context,
      });
    } catch (e: any) {
      throw new InternalServerErrorException(e.message);
    }
    return true;
  }

  async signin(intraId: string, user: User): Promise<void | never> {
    if (user.role !== UserRole.NOVICE) {
      throw new ForbiddenException(SIGNIN_ALREADY_AUTH_ERROR_MESSAGE);
    }

    await this.checkExistCadet(intraId);

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

  async getAuth(code: string): Promise<void | never> {
    const intraAuthMailDto = await this.cacheService.getIntraAuthMailData(code);

    if (!intraAuthMailDto) {
      throw new ForbiddenException(NOT_EXIST_TOKEN_ERROR_MESSAGE);
    }

    await this.checkExistCadet(intraAuthMailDto.intraId);

    const user = await this.userService.findOneByIdOrFail(intraAuthMailDto.userId);

    await this.userService.updateToCadet(user, {
      role: UserRole.CADET,
      nickname: intraAuthMailDto.intraId,
    });
    await this.intraAuthRepository.save(intraAuthMailDto);
    await this.cacheService.del(code);
  }

  private async checkExistCadet(intraId: string): Promise<void | never> {
    const cadet = await this.intraAuthRepository.findOne({
      intraId: intraId,
    });

    if (cadet) {
      throw new ForbiddenException(CADET_ALREADY_EXIST_ERROR_MESSAGE);
    }
  }
}
