export function toArray<T>(value: T): T extends any[] ? T : T[] {
  if (value == null) return [] as any;
  if (Array.isArray(value)) return value as any;
  return [value] as any;
}

export function compareArrays<T>(
  current: T[],
  selected: T[],
): { notInCurrent: T[]; notInSelected: T[] } {
  // Элементы из selected, которых нет в current
  const notInCurrent: T[] = selected.filter((item) => !current.includes(item));
  // Элементы из current, которых нет в selected
  const notInSelected: T[] = current.filter((item) => !selected.includes(item));
  return { notInCurrent, notInSelected };
}
