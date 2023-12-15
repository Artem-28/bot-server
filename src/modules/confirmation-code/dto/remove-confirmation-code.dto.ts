import { ConfirmationTypeEnum } from '@/base/enum/confirmation/confirmation-type.enum';

export class RemoveConfirmationCodeDto {
  email: string;

  type: ConfirmationTypeEnum;
}
