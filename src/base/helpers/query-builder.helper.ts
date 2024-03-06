// Types
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  QueryFilter,
  QueryRelation,
} from '@/base/interfaces/service.interface';
import { BaseObjectMap } from '@/base/interfaces/base.interface';

// Entities
import { Project } from '@/modules/project/project.entity';
import { Script } from '@/modules/script/script.entity';
import { ProjectSubscriber } from '@/modules/project-subscriber/projectSubscriber.entity';
import { User } from '@/modules/user/user.entity';
import { DropdownOption } from '@/modules/dropdown-option/dropdown-option.entity';
import { Question } from '@/modules/question/question.entity';
import { Permission } from '@/modules/permission/permission.entity';
import { Respondent } from '@/modules/respondent/respondent.entity';
import { PermissionUser } from '@/modules/permission/permission-user.entity';
import { Session } from '@/modules/session/session.entity';

// Helpers
import { toArray } from '@/base/helpers/array.helper';

type Entity =
  | Project
  | Script
  | Question
  | ProjectSubscriber
  | User
  | DropdownOption
  | Permission
  | PermissionUser
  | Respondent
  | Session;
interface Options {
  alias?: string;
  filter?: QueryFilter | QueryFilter[];
  relation?: QueryRelation | QueryRelation[];
}
export default class QueryBuilderHelper<T extends Entity> {
  private readonly _repository: Repository<T>;
  private _builder: SelectQueryBuilder<T>;
  private readonly _alias: string;
  private readonly _queryFilter: BaseObjectMap<QueryFilter> = {};
  private readonly _queryRelation: BaseObjectMap<QueryRelation> = {};
  private readonly _querySelect: BaseObjectMap<string[]> = {};

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
  get filters() {
    let isSetWhereFilter = false;
    const filters = Object.values(this._queryFilter).map((filter) => {
      // Если установлен оператор
      if (filter.operator) return filter;
      // Если не установлен where filter
      if (!isSetWhereFilter) {
        isSetWhereFilter = true;
        return filter;
      }
      // Устанавливаем оператор
      filter.operator = 'and';
      return filter;
    });
    return filters.sort((a, b) => b.operator?.length - a.operator?.length);
  }

  get conditions(): BaseObjectMap<string> {
    return Object.keys(this._queryFilter).reduce((acc, currentKey) => {
      const filter = this._queryFilter[currentKey];
      if (typeof filter.callback !== 'function') return acc;
      const [alias] = currentKey.split('.');
      acc[alias] = filter.field;
      return acc;
    }, {});
  }

  private _setWhereFilter(filter: QueryFilter) {
    const { field, value, callback } = filter;

    if (typeof callback === 'function') {
      this._builder.andWhere(callback(filter));
      return;
    }

    if (!value) {
      this._builder.where(field);
      return;
    }

    this._builder.where(field, value);
  }

  private _setAndWhereFilter(filter: QueryFilter) {
    const { field, value, callback } = filter;

    if (typeof callback === 'function') {
      this._builder.andWhere(callback(filter));
      return;
    }

    if (!value) {
      this._builder.andWhere(field);
      return;
    }

    this._builder.andWhere(field, value);
  }

  private _setOrWhereFilter(filter: QueryFilter) {
    const { field, value, callback } = filter;

    if (typeof callback === 'function') {
      this._builder.andWhere(callback(filter));
      return;
    }

    if (!value) {
      this._builder.orWhere(field);
      return;
    }

    this._builder.orWhere(field, value);
  }

  private _setFilter(): void {
    this.filters.forEach((filter) => {
      switch (filter.operator) {
        case 'and':
          this._setAndWhereFilter(filter);
          break;
        case 'or':
          this._setOrWhereFilter(filter);
          break;
        default:
          this._setWhereFilter(filter);
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
      const { name, alias, methods } = relation;
      const condition = this.conditions[alias];
      switch (methods) {
        case 'leftJoinAndSelect':
          this._builder.leftJoinAndSelect(name, alias, condition);
          break;
        case 'innerJoinAndSelect':
          this._builder.innerJoinAndSelect(name, alias, condition);
          break;
        case 'innerJoin':
          this._builder.innerJoin(name, alias, condition);
          break;
        case 'leftJoin':
          this._builder.leftJoin(name, alias, condition);
          break;
        default:
          this._builder.leftJoinAndSelect(name, alias, condition);
      }
    });
  }

  private _resetBuilder(): void {
    this._builder = this._repository.createQueryBuilder(this._alias);
    this._setRelation();
    this._setSelect();
    this._setFilter();
  }

  private _getFilterOperator(filter: QueryFilter): string {
    if (Array.isArray(filter.value)) return ' IN';
    if (filter.value === null) return ' IS NULL';
    return ' =';
  }

  private _getFilterValueAlias(filter: QueryFilter): string {
    const dataField = filter.field.split('.');
    const field = dataField[dataField.length - 1];
    if (Array.isArray(filter.value)) return ` (:...${field})`;
    if (filter.value === null) return '';
    return ` :${field}`;
  }

  private _getFilterValue(filter: QueryFilter) {
    if (filter.value === null) return {};
    const dataField = filter.field.split('.');
    const field = dataField[dataField.length - 1];
    return { value: { [field]: filter.value } };
  }

  private _getFilterFieldAlias(filter: QueryFilter) {
    let alias = this._alias;
    const dataField = filter.field.split('.');
    const field = dataField[dataField.length - 1];
    if (dataField.length > 1) {
      alias = dataField[dataField.length - 2];
    }
    return `${alias}.${field}`;
  }

  private _saveFilter(filter: QueryFilter) {
    const operator = this._getFilterOperator(filter);
    const valueAlias = this._getFilterValueAlias(filter);
    const fieldAlias = this._getFilterFieldAlias(filter);
    const value = this._getFilterValue(filter);
    const field = `${fieldAlias}${operator}${valueAlias}`;
    this._queryFilter[fieldAlias] = {
      field,
      callback: filter.callback,
      ...value,
    };
  }

  private _updateQueryFilter(
    filter: QueryFilter | QueryFilter[] | undefined,
  ): void {
    toArray(filter).forEach((data) => {
      this._saveFilter(data);
    });
  }

  private _updateQueryRelation(
    relation: QueryRelation | QueryRelation[] | undefined,
  ): void {
    toArray(relation).forEach((data) => {
      const name = `${this._alias}.${data.name}`;
      const alias = data.alias || data.name;
      this._updateQuerySelect(data.select, alias);
      const methods = data.methods;
      this._queryRelation[alias] = { name, alias, methods };
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
