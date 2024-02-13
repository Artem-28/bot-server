import { Brackets } from 'typeorm';

export interface QueryFilter {
  field: string;
  value?: any | any[];
  operator?: 'and' | 'or';
  callback?: (filter: QueryFilter) => Brackets;
}

export interface QueryRelation {
  name: string;
  alias?: string;
  select?: string | string[];
  methods?: string;
}

export interface Options {
  throwException?: boolean;
  filter?: QueryFilter | QueryFilter[];
  relation?: QueryRelation | QueryRelation[];
}

export interface QuerySelect {
  [key: string]: string[];
}
