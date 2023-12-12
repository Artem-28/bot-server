export interface QueryFilter {
  field: string;
  value: any | any[];
  operator?: 'and' | 'or';
}

export interface QueryRelation {
  name: string;
  alias?: string;
  select?: string | string[];
}

export interface Options {
  throwException?: boolean;
  filter?: QueryFilter | QueryFilter[];
  relation?: QueryRelation | QueryRelation[];
}

export interface QuerySelect {
  [key: string]: string[];
}
