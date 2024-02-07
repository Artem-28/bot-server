import { QuestionTypeEnum } from '@/base/enum/dropdown-option/question-type.enum';
import { IsDefined, IsEnum } from 'class-validator';

export class CreateQuestionDto {
  scriptId?: number;

  @IsDefined()
  @IsEnum(QuestionTypeEnum)
  type: QuestionTypeEnum;

  text?: string | null;

  started?: boolean;
}
