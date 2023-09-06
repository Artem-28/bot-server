import { IsEmail, IsEnum, IsDefined } from 'class-validator';
import {
  EnumConfirmation,
  TEnumConfirmationType,
} from '../../enum/EnumConfirmation';

export class CheckConfirmationCodeDto {
  @IsEmail()
  email: string;

  @IsEnum(EnumConfirmation)
  type: TEnumConfirmationType;

  @IsDefined()
  code?: string;
}
