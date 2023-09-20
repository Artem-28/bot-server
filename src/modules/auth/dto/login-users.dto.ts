import { IsDefined, IsEmail } from 'class-validator';

export class LoginUsersDto {
  @IsEmail()
  email: string;

  @IsDefined()
  password: string;
}
