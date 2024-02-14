import { toArray } from '@/base/helpers/array.helper';
import { HttpException } from '@nestjs/common';

export function checkRequiredField<T>(
  obj: T,
  field: string | string[],
  throwException?: boolean,
): boolean {
  if (!obj) return false;
  const fields = toArray(field);
  const valid = fields.every((f) => obj.hasOwnProperty(f));
  if (!valid && throwException) {
    throw new HttpException('check_params.invalid_params', 500);
  }
  return valid;
}
