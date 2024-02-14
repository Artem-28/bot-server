export interface BaseObjectMap<T> {
  [key: string]: T;
}

export interface BaseHttpParam {
  userId?: number;
  projectId?: number;
  scriptId?: number;
  questionId?: number;
}
