import {
  toArray,
  UserEntity,
  OrderDto,
  PaginationDto,
  QueryBuilderOptionsDto,
} from '@/app-services';
import { Repository, SelectQueryBuilder } from 'typeorm';

type Entity = UserEntity;

export class QueryBuilderHelper<T extends Entity> {
  private readonly _repository: Repository<T>;
  private readonly _alias: string;
  private _builder: SelectQueryBuilder<T>;
  private _orders: OrderDto[] = [];
  private _pagination: PaginationDto;

  constructor(repository: Repository<T>, options?: QueryBuilderOptionsDto) {
    const { alias, order, pagination } = options;
    this._repository = repository;
    this._alias = alias;
    this.order(order);
    this.pagination(pagination);
  }

  get builder() {
    this._setupBuilder();
    return this._builder;
  }

  private _setupBuilder() {
    this._builder = this._repository.createQueryBuilder(this._alias);
    this._setupPagination();
    this._setupOrder();
  }

  private _setupOrder() {
    this._orders.forEach(({ sort, order, nulls }) => {
      this._builder.addOrderBy(sort, order, nulls);
    });
  }

  private _setupPagination() {
    const { skip, take } = this._pagination;
    this._builder.take(take).skip(skip);
  }

  public order(order: OrderDto | OrderDto[]) {
    this._orders = toArray(order);
  }

  public pagination(pagination: PaginationDto) {
    this._pagination = pagination;
  }
}
