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

export function compareFieldValues<T, R>(
  obj: T,
  obj2: R,
  field: string | string[],
): boolean {
  const fields = toArray(field);
  return fields.every((f) => {
    if (!obj.hasOwnProperty(f) || !obj2.hasOwnProperty(f)) return false;
    return obj[f] === obj2[f];
  });
}
