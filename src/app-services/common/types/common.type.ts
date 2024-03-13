export interface LiteralObject<T> {
  [key: string]: T;
}

export class ResponseWithCount<T> {
  data: T[];
  count: number;
}
