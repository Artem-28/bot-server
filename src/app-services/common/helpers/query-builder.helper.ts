import {
  toArray,
  OrderDto,
  PaginationDto,
  QueryBuilderOptionsDto,
  QueryBuilderFilterDto,
  AnyEntity,
  LiteralObject,
} from '@/app-services';
import { Repository, SelectQueryBuilder } from 'typeorm';

export class QueryBuilderHelper<T extends AnyEntity> {
  private readonly _repository: Repository<T>;
  private readonly _alias: string;
  private _builder: SelectQueryBuilder<T>;
  private _orders: OrderDto[] = [];
  private _whereFilter: QueryBuilderFilter | null = null;
  private _andFilters: LiteralObject<QueryBuilderFilter> = {};
  private _orFilters: LiteralObject<QueryBuilderFilter> = {};
  private _pagination?: PaginationDto;

  constructor(repository: Repository<T>, options?: QueryBuilderOptionsDto) {
    const { alias, order, pagination, filter } = options;
    this._repository = repository;
    this._alias = alias || 'entity';
    this.order(order);
    this.pagination(pagination);
    this.filter(filter);
  }

  get builder() {
    this._setupBuilder();
    return this._builder;
  }

  private _setupBuilder() {
    this._builder = this._repository.createQueryBuilder(this._alias);
    this._setupFilter();
    this._setupPagination();
    this._setupOrder();
  }

  private _setupOrder() {
    this._orders.forEach(({ sort, order, nulls }) => {
      this._builder.addOrderBy(sort, order, nulls);
    });
  }

  private _setupPagination() {
    if (!this._pagination) return;
    const { skip, take } = this._pagination;
    this._builder.take(take).skip(skip);
  }

  private _setupFilter() {
    if (!this._whereFilter) return;
    this._whereFilter.setWhere<T>(this._builder);
    Object.values(this._andFilters).forEach((f) => f.set(this._builder));
    Object.values(this._orFilters).forEach((f) => f.set(this._builder));
  }

  public order(order: OrderDto | OrderDto[]) {
    this._orders = toArray(order);
  }

  public pagination(pagination: PaginationDto) {
    this._pagination = pagination;
  }

  public filter(filter: QueryBuilderFilterDto | QueryBuilderFilterDto[]) {
    toArray(filter).forEach((dto) => {
      const f = new QueryBuilderFilter(dto, this._alias);
      if (!this._whereFilter) {
        this._whereFilter = f;
        return;
      }
      if (dto.operator === 'or') {
        this._orFilters[f.alias] = f;
        return;
      }
      this._andFilters[f.alias] = f;
    });
  }
}

export class QueryBuilderFilter {
  private readonly _filter: QueryBuilderFilterDto;
  private readonly _alias: string;
  constructor(filter: QueryBuilderFilterDto, alias: string) {
    this._filter = filter;
    this._alias = alias || '';
  }

  get alias(): string {
    return this._filterAlias;
  }

  get field(): string {
    return `${this._filterAlias}${this._operator}${this._valueAlias}`;
  }

  get value(): LiteralObject<string> {
    if (this._filter.value === null) return {};
    const dataField = this._filter.field.split('.');
    const field = dataField[dataField.length - 1];
    return { [field]: this._filter.value };
  }

  private get _filterAlias(): string {
    let alias = this._alias;
    const dataField = this._filter.field.split('.');
    const field = dataField[dataField.length - 1];
    if (dataField.length > 1) {
      alias = dataField[dataField.length - 2];
    }
    return `${alias}.${field}`;
  }

  private get _valueAlias(): string {
    const dataField = this._filter.field.split('.');
    const field = dataField[dataField.length - 1];
    if (Array.isArray(this._filter.value)) return ` (:...${field})`;
    if (this._filter.value === null) return '';
    return ` :${field}`;
  }

  private get _operator(): string {
    if (Array.isArray(this._filter.value)) return ' IN';
    if (this._filter.value === null) return ' IS NULL';
    return ' =';
  }

  private _setOr<T>(builder: SelectQueryBuilder<T>) {
    if (typeof this._filter.callback === 'function') {
      builder.andWhere(this._filter.callback(this));
      return;
    }
    builder.orWhere(this.field, this.value);
  }

  private _setAnd<T>(builder: SelectQueryBuilder<T>) {
    if (typeof this._filter.callback === 'function') {
      builder.andWhere(this._filter.callback(this));
      return;
    }
    builder.andWhere(this.field, this.value);
  }

  public setWhere<T>(builder: SelectQueryBuilder<T>) {
    if (typeof this._filter.callback === 'function') {
      builder.andWhere(this._filter.callback(this));
      return;
    }
    builder.where(this.field, this.value);
  }

  public set<T>(builder: SelectQueryBuilder<T>) {
    if (this._filter.operator === 'or') {
      this._setOr(builder);
      return;
    }
    this._setAnd(builder);
  }
}
