import { ConfirmationTypeEnum } from '@/base/enum/confirmation/confirmation-type.enum';

export interface IResponseSendCode {
  email: string;
  type: ConfirmationTypeEnum;
  delay: number;
  live: number;
}

export interface IResponseCheckCode {
  confirm: boolean;
  delay: boolean;
  live: boolean;
}
