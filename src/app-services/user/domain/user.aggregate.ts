import { User } from '@app-services/user/domain/user.interface';
import { UserServices } from './services';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  validateSync,
} from 'class-validator';
import { Exclude } from 'class-transformer';

export class UserAggregate extends UserServices implements User {
  @IsNumber()
  id?: number;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Exclude()
  password: string;

  @IsBoolean()
  licenseAgreement = false;
  phone = null;
  emailVerifiedAt = null;
  lastActiveAt = null;
  phoneVerifiedAt = null;

  @IsDate()
  createdAt = new Date();

  @IsDate()
  updatedAt = new Date();

  private constructor() {
    super();
  }

  static create(data: Partial<User>) {
    const _user = new UserAggregate();
    Object.assign(_user, data);
    _user.updatedAt = data?.id ? new Date() : _user.updatedAt;
    const errors = validateSync(_user, { whitelist: true });
    if (!!errors.length) {
      throw new Error('User not valid');
    }
    return _user;
  }
}
