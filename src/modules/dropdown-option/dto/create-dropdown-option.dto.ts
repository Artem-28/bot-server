import { IsBoolean, IsDefined, IsEnum, IsString } from 'class-validator';
import { QuestionTypeEnum } from '@/base/enum/dropdown-option/question-type.enum';
import { DropdownTypeEnum } from '@/base/enum/dropdown-option/dropdown-type.enum';

export class CreateDropdownOptionDto {
  @IsDefined()
  @IsEnum(DropdownTypeEnum)
  type: DropdownTypeEnum;

  @IsDefined()
  @IsEnum(QuestionTypeEnum)
  code: QuestionTypeEnum;

  @IsDefined()
  @IsString()
  label: string;

  @IsDefined()
  @IsBoolean()
  enable: boolean;
}
