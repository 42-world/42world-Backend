import {
  CADET_ALREADY_EXIST_ERROR_MESSAGE,
  NOT_EXIST_TOKEN_ERROR_MESSAGE,
  SIGNIN_ALREADY_AUTH_ERROR_MESSAGE,
} from '@api/intra-auth/intra-auth.constant';
import { UserService } from '@api/user/user.service';
import { CacheService } from '@app/common/cache/cache.service';
import { IntraAuthMailDto } from '@app/common/cache/dto/intra-auth.dto';
import { IntraAuth } from '@app/entity/intra-auth/intra-auth.entity';
import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { User } from '@app/entity/user/user.entity';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getCode } from './intra-auth.utils';
import MailService from './mail.service';
import UnsubscribeStibeeService from './unsubscribe-stibee.service';

@Injectable()
export class IntraAuthService {
  constructor(
    @Inject('MailService') private readonly mailService: MailService,
    @Inject('UnsubscribeStibeeService') private readonly unsubscribeStibeeService: UnsubscribeStibeeService,
    private readonly userService: UserService,
    private readonly cacheService: CacheService,

    @InjectRepository(IntraAuth)
    private readonly intraAuthRepository: Repository<IntraAuth>,
  ) {}

  async signin(intraId: string, user: User): Promise<void | never> {
    if (user.role !== UserRole.NOVICE) {
      throw new ForbiddenException(SIGNIN_ALREADY_AUTH_ERROR_MESSAGE);
    }

    await this.checkExistCadet(intraId);

    const code = await getCode(intraId);
    const intraAuthMailDto = new IntraAuthMailDto(user.id, intraId);

    await this.cacheService.setIntraAuthMailData(code, intraAuthMailDto);

    await this.mailService.send(intraId, code, user.nickname);
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
    await this.unsubscribeStibeeService.unsubscribe(intraAuthMailDto.intraId);
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
