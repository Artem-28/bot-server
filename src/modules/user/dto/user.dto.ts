import { IsBoolean, IsEmail, IsString, MinLength } from 'class-validator';

const updatableFields = ['email', 'password', 'phone', 'permissions'];

export class UserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsBoolean()
  licenseAgreement: boolean;

  phone?: string;

  emailVerifiedAt?: Date;

  phoneVerifiedAt?: Date;
}

export function getUpdateDto(data: Partial<UserDto>): Partial<UserDto> {
  return updatableFields.reduce((acc, field) => {
    if (data.hasOwnProperty(field)) {
      acc[field] = data[field];
    }
    return acc;
  }, {} as Partial<UserDto>);
}
