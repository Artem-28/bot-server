import { IsEmail, IsEnum } from 'class-validator';
import { EnumConfirmation } from '../../enum/EnumConfirmation';

export class CreateConfirmationCodeDto {
  @IsEmail()
  email: string;

  @IsEnum(EnumConfirmation)
  type: EnumConfirmation.TYPE_REGISTRATION;
}
