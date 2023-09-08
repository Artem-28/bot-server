import { CreateUsersDto } from './create-users.dto';
import { IsDefined, IsString, MinLength } from 'class-validator';

export class RegistrationUserDto extends CreateUsersDto {
  @IsString()
  @MinLength(6)
  confirmPassword: string;

  @IsDefined()
  code: string;
}
