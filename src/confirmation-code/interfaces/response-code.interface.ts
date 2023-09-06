import { TEnumConfirmationType } from '../../enum/EnumConfirmation';

export interface IResponseSendCode {
  email: string;
  type: TEnumConfirmationType;
  delay: number;
  live: number;
}

export interface IResponseCheckCode {
  confirm: boolean;
  delay: boolean;
  live: boolean;
}