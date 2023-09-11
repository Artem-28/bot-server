import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsString,
  MinLength,
} from 'class-validator';

export class RegistrationUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsBoolean()
  licenseAgreement: boolean;

  @IsString()
  @MinLength(6)
  confirmPassword: string;

  @IsDefined()
  code: string;
}
