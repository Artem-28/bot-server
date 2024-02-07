import { CreateQuestionDto } from '@/modules/question/dto/create-question.dto';

export class UpdateQuestionDto {
  text?: string | null;

  started?: boolean;
}

export function getUpdateDto(
  data: Partial<CreateQuestionDto>,
): UpdateQuestionDto {
  const updatableFields = ['text', 'started'];
  return updatableFields.reduce((acc, field) => {
    if (data.hasOwnProperty(field)) {
      acc[field] = data[field];
    }
    return acc;
  }, {} as UpdateQuestionDto);
}
