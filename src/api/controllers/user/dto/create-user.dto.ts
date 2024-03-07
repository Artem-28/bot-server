import { CreateUserDto as ICreateUserDto } from '@app-services/user/service/commands/dto';
import { IsBoolean, IsDefined, IsEmail, IsString } from 'class-validator';

export class CreateUserDto implements ICreateUserDto {
  @IsEmail()
  @IsDefined()
  email: string;

  @IsBoolean()
  @IsDefined()
  licenseAgreement: boolean;

  @IsString()
  @IsDefined()
  password: string;
}
