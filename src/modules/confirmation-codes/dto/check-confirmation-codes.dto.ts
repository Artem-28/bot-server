import { IsEmail, IsEnum, IsDefined } from 'class-validator';
import {
  ConfirmationTypeEnum,
} from '../../../base/enum/confirmation/confirmation-type.enum';

export class CheckConfirmationCodesDto {
  @IsEmail()
  email: string;

  @IsEnum(ConfirmationTypeEnum)
  type: ConfirmationTypeEnum;

  @IsDefined()
  code?: string;
}
