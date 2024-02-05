import { CreateScriptDto } from '@/modules/script/dto/create-script.dto';
import { UpdateScriptDto } from '@/modules/script/dto/update-script-dto';

export function validateUpdateDto(
  data: Partial<CreateScriptDto>,
): UpdateScriptDto {
  const dto: UpdateScriptDto = {};
  if (data.hasOwnProperty('title')) {
    dto.title = data.title;
  }
  return dto;
}
