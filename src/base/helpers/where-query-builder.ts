import {
  DeleteQueryBuilder,
  SelectQueryBuilder,
  UpdateQueryBuilder,
} from 'typeorm';

export interface IFilterQueryBuilder {
  field: string;
  value: any;
  operator?: 'and' | 'or';
}

type TRootQuery =
  | SelectQueryBuilder<any>
  | UpdateQueryBuilder<any>
  | DeleteQueryBuilder<any>;

export function whereQueryBuilder(
  rootQuery: TRootQuery,
  filters: IFilterQueryBuilder[],
) {
  const whereFilters = filters.filter((filter) => !filter.operator);
  if (whereFilters.length) {
    const params = whereFilters.reduce((acc, current) => {
      acc[current.field] = current.value;
      return acc;
    }, {});
    rootQuery.where(params);
  }
  filters.forEach((filter) => {
    const params = { [filter.field]: filter.value };
    switch (filter.operator) {
      case 'and':
        rootQuery.andWhere(params);
        break;
      case 'or':
        rootQuery.orWhere(params);
        break;
      default:
        break;
    }
  });
  return rootQuery;
}
