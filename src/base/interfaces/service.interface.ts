import { Brackets, EntityManager } from 'typeorm';
import { BaseHttpParam } from '@/base/interfaces/base.interface';

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
  param?: BaseHttpParam;
  dataSourceManager?: EntityManager;
}

export interface QuerySelect {
  [key: string]: string[];
}
