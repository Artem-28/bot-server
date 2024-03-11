import { User as IUser } from '@app-services/user/domain';

export type UpdateUserDto = Partial<
  Pick<
    IUser,
    | 'email'
    | 'password'
    | 'phone'
    | 'phoneVerifiedAt'
    | 'licenseAgreement'
    | 'lastActiveAt'
    | 'emailVerifiedAt'
  >
> &
  Pick<IUser, 'id'>;
