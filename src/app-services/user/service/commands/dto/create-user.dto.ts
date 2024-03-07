import { User as IUser } from '@app-services/user/domain';

export type CreateUserDto = Pick<
  IUser,
  'email' | 'password' | 'licenseAgreement'
>;
