import { IntraAuth } from '@app/entity/intra-auth/intra-auth.entity';
import { PartialType } from '@nestjs/mapped-types';

export class SeederDataIntraAuth extends PartialType(IntraAuth) {
  id: number;
  intraId: string;
  userId: number;
}

export const intraAuthData: SeederDataIntraAuth[] = [
  {
    id: 1,
    intraId: 'cadetUserIntraId',
    userId: 2,
  },
  {
    id: 2,
    intraId: 'adminUserIntraId',
    userId: 3,
  },
];
