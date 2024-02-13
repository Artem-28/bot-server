import { QuestionTypeEnum } from '@/base/enum/dropdown-option/question-type.enum';
import { IsDefined, IsEnum } from 'class-validator';

const updatableFields = ['text', 'started'];

export class QuestionDto {
  @IsDefined()
  @IsEnum(QuestionTypeEnum)
  type: QuestionTypeEnum;

  scriptId?: number;

  text?: string | null;

  started?: boolean;
}

export function getUpdateDto(data: Partial<QuestionDto>): Partial<QuestionDto> {
  return updatableFields.reduce((acc, field) => {
    if (data.hasOwnProperty(field)) {
      acc[field] = data[field];
    }
    return acc;
  }, {} as Partial<QuestionDto>);
}
