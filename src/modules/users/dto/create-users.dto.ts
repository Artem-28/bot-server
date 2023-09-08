import { IsBoolean, IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUsersDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsBoolean()
  licenseAgreement: boolean;

  phone?: string;
}
