import { IsDefined, IsEmail, IsNumber } from 'class-validator';

export class RespondentDto {
  @IsDefined()
  @IsEmail()
  email: string;
}

export class CreateRespondentDto extends RespondentDto {
  @IsDefined()
  @IsNumber()
  projectId: number;
}
