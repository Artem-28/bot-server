// Types
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  QueryFilter,
  QueryRelation,
  QuerySelect,
} from '@/base/interfaces/service.interface';

// Entities
import { Project } from '@/modules/project/project.entity';
import { Script } from '@/modules/script/script.entity';
import { ProjectSubscriber } from '@/modules/project-subscriber/projectSubscriber.entity';
import { User } from '@/modules/user/user.entity';
import { DropdownOption } from '@/modules/dropdown-option/dropdown-option.entity';
import { Question } from '@/modules/question/question.entity';

// Helpers
import { toArray } from '@/base/helpers/array-helper';

type Entity =
  | Project
  | Script
  | Question
  | ProjectSubscriber
  | User
  | DropdownOption;
interface Options {
  alias?: string;
  filter?: QueryFilter | QueryFilter[];
  relation?: QueryRelation | QueryRelation[];
}
interface Relation {
  [key: string]: QueryRelation;
}

export default class QueryBuilderHelper<T extends Entity> {
  private readonly _repository: Repository<T>;
  private _builder: SelectQueryBuilder<T>;
  private readonly _alias: string;
  private readonly _queryFilter: QueryFilter[] = [];
  private readonly _queryRelation: Relation = {};
  private readonly _querySelect: QuerySelect = {};

  constructor(repository: Repository<T>, options?: Options) {
    const { alias, filter, relation } = options || {};
    this._alias = alias || 'entity';
    this._repository = repository;
    this._updateQueryFilter(filter);
    this._updateQueryRelation(relation);
    this._resetBuilder();
  }

  get builder(): SelectQueryBuilder<T> {
    return this._builder;
  }

  private _setFilter(): void {
    const whereFilter = this._queryFilter.find((filter) => !filter.operator);
    if (whereFilter) {
      this._builder.where(whereFilter.field, whereFilter.value);
    }
    this._queryFilter.forEach((filter) => {
      if (filter.field === whereFilter.field) return;
      switch (filter.operator) {
        case 'and':
          this._builder.andWhere(filter.field, filter.value);
          break;
        case 'or':
          this._builder.orWhere(filter.field, filter.value);
          break;
        default:
          this._builder.andWhere(filter.field, filter.value);
          break;
      }
    });
  }

  private _setSelect() {
    Object.values(this._querySelect).forEach((selects) =>
      this._builder.addSelect(selects),
    );
  }

  private _setRelation() {
    Object.values(this._queryRelation).forEach((relation) => {
      const { name, alias } = relation;
      if (this._querySelect.hasOwnProperty(alias)) {
        this._builder.leftJoin(name, alias);
        return;
      }
      this._builder.leftJoinAndSelect(name, alias);
    });
  }

  private _resetBuilder(): void {
    this._builder = this._repository.createQueryBuilder(this._alias);
    this._setRelation();
    this._setSelect();
    this._setFilter();
  }

  private _formatterFilter(filter: QueryFilter) {
    const isArrayValue = Array.isArray(filter.value);
    const operator = isArrayValue ? 'IN' : '=';
    const valueAlias = isArrayValue
      ? `(:...${filter.field})`
      : `:${filter.field}`;
    const field = `${this._alias}.${filter.field} ${operator} ${valueAlias}`;
    return {
      field,
      value: { [filter.field]: filter.value },
    };
  }

  private _updateQueryFilter(
    filter: QueryFilter | QueryFilter[] | undefined,
  ): void {
    toArray(filter).forEach((data) => {
      const formatFilter = this._formatterFilter(data);
      this._queryFilter.push(formatFilter);
    });
  }

  private _updateQueryRelation(
    relation: QueryRelation | QueryRelation[] | undefined,
  ): void {
    toArray(relation).forEach((data) => {
      const name = `${this._alias}.${data.name}`;
      const alias = data.alias || data.name;
      this._updateQuerySelect(data.select, alias);
      this._queryRelation[name] = { name, alias };
    });
  }

  private _updateQuerySelect(
    selects: string | string[] | undefined,
    alias: string = this._alias,
  ): void {
    toArray(selects).forEach((field) => {
      const select = `${alias}.${field}`;
      if (this._querySelect.hasOwnProperty(alias)) {
        this._querySelect[alias] = [...this._querySelect[alias], select];
        return;
      }
      this._querySelect[alias] = [select];
    });
  }

  public filter(filter: QueryFilter | QueryFilter[]): SelectQueryBuilder<T> {
    this._updateQueryFilter(filter);
    this._resetBuilder();
    return this.builder;
  }

  public relation(relation: QueryRelation | QueryRelation[]) {
    this._updateQueryRelation(relation);
    this._resetBuilder();
    return this.builder;
  }
}
