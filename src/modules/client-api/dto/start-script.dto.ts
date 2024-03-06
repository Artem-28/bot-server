import { IsDefined, IsNumber } from 'class-validator';
import { RespondentDto } from '@/modules/respondent/dto/respondent.dto';

export class StartScriptDto {
  @IsDefined()
  @IsNumber()
  scriptId: number;

  respondent?: RespondentDto;
}
