import { camelToSnake } from '@app-services';

export function camelToKebabValue<T>(
  obj: T,
  keys?: (keyof T)[],
): { [K in keyof T]: string | unknown } {
  const result = {} as { [K in keyof T]: string | unknown };

  const validateKey = (key: keyof T) => {
    if (!keys || !keys.length) return true;
    return keys.includes(key);
  };

  Object.entries(obj).forEach(([key, value]) => {
    if (!validateKey(key as keyof T)) {
      result[key as keyof T] = value;
      return;
    }

    const valueToString = value.toString();
    result[key as keyof T] = camelToSnake(valueToString);
  });

  return result;
}
