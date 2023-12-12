import { Project } from '../../modules/project/project.entity';
import { Script } from '../../modules/script/script.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { IFilterQueryBuilder } from './where-query-builder';
import {
  IProjectGetQueryMethods,
  IProjectUpdateQueryMethods,
} from '../../modules/project/interfaces/query-helper';

type Entity = Project | Script;
type Filter = IFilterQueryBuilder[] | IFilterQueryBuilder;
type Methods = IProjectGetQueryMethods | IProjectUpdateQueryMethods;

export class QueryHandler<T extends Entity, D extends Methods> {
  private readonly _builder: SelectQueryBuilder<T>;
  private readonly _alias = 'entity';
  private readonly _methods: D;
  constructor(repository: Repository<T>, methods?: D) {
    this._builder = repository.createQueryBuilder(this._alias);
    this._methods = methods;
  }

  private get _defaultMethods() {
    return {
      filter: (filters: Filter) => this.filter(filters),
      builder: this._builder,
    };
  }

  public get builder() {
    return this._builder;
  }

  public get methods() {
    return { ...this._defaultMethods, ...this._methods };
  }

  public filter(filters: Filter) {
    if (!Array.isArray(filters)) {
      filters = [filters];
    }
    const whereFilter = filters.find((filter) => !filter.operator);
    if (whereFilter) {
      this._builder.where({ [whereFilter.field]: whereFilter.value });
    }
    filters.forEach((filter) => {
      const params = { [filter.field]: filter.value };
      switch (filter.operator) {
        case 'and':
          this._builder.andWhere(params);
          break;
        case 'or':
          this._builder.orWhere(params);
          break;
        default:
          break;
      }
    });
    return { ...this.methods, builder: this.builder };
  }
}
