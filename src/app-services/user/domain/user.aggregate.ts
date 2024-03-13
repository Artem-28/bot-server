import { User } from '@app-services/user/domain/user.interface';
import { UserServices } from './services';
import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';
import { Exclude } from 'class-transformer';
import { DomainError } from '@app-services/error';

export class UserAggregate extends UserServices implements User {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsEmail()
  @IsDefined()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @Exclude()
  password: string;

  @IsBoolean()
  @IsDefined()
  licenseAgreement = false;

  @IsOptional()
  @IsString()
  phone = null;

  @IsOptional()
  @IsDate()
  emailVerifiedAt = null;

  @IsOptional()
  @IsDate()
  lastActiveAt = null;

  @IsOptional()
  @IsDate()
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
      throw new DomainError(errors, { message: 'User not valid ' });
    }
    return _user;
  }
}
