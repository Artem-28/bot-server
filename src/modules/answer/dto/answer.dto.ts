import { IsDefined, IsInt } from 'class-validator';

const updatableFields = ['text'];

export class AnswerDto {
  @IsDefined()
  @IsInt()
  questionId: number;

  text?: string;
}

export function getUpdateDto(data: Partial<AnswerDto>): Partial<AnswerDto> {
  return updatableFields.reduce((acc, field) => {
    if (data.hasOwnProperty(field)) {
      acc[field] = data[field];
    }
    return acc;
  }, {} as Partial<AnswerDto>);
}
