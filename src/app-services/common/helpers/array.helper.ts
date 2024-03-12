export function toArray<T>(value: T): T extends any[] ? T : T[] {
  if (value == null) return [] as any;
  if (Array.isArray(value)) return value as any;
  return [value] as any;
}
