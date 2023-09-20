import { IsEmail, IsEnum } from 'class-validator';
import { ConfirmationTypeEnum } from '../../../base/enum/confirmation/confirmation-type.enum';

export class CreateConfirmationCodeDto {
  @IsEmail()
  email: string;

  @IsEnum(ConfirmationTypeEnum)
  type: ConfirmationTypeEnum;
}
