import { toArray } from '@/base/helpers/array.helper';

export function checkRequiredField<T>(
  obj: T,
  field: string | string[],
): boolean {
  if (!obj) return false;
  const fields = toArray(field);
  return fields.every((f) => obj.hasOwnProperty(f));
}
