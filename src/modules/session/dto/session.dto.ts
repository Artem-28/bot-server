import { IsDefined, IsNumber } from 'class-validator';
import { RespondentDto } from '@/modules/respondent/dto/respondent.dto';

export class SessionDto {
  @IsDefined()
  @IsNumber()
  scriptId: number;

  @IsDefined()
  @IsNumber()
  respondentId: number;
}

export class CreateSessionDto {
  @IsDefined()
  @IsNumber()
  scriptId: number;

  @IsDefined()
  respondent: RespondentDto;
}
