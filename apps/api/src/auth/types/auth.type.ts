import { UserRole } from '@app/entity/user/interfaces/userrole.interface';

export type AuthType = 'allow' | 'deny';

export type AuthDecoratorParam = [AuthType, ...UserRole[]];
