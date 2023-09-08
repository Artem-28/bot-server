import { IsEmail } from 'class-validator';

export class MailMessageOptionsDto {
  @IsEmail()
  to: string;

  subject: string;

  template: string;

  context: {
    [key: string]: any;
  };
}
