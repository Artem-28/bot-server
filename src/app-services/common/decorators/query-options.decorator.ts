import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import {
  PaginationDto,
  QueryBuilderOptionsDto,
  OrderDto,
  camelToKebabValue,
} from '@app-services';

export const QueryOptions = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): QueryBuilderOptionsDto => {
    const request = ctx.switchToHttp().getRequest();
    const pagination = getPagination(request);
    const order = getOrder(request);
    return plainToInstance(QueryBuilderOptionsDto, {
      pagination,
      order,
    });
  },
);

function getPagination(request: any) {
  const { page, limit } = request.query;
  const pageNum = Number(page) || 1;
  const take = Number(limit) || 0;
  const skip = (pageNum - 1) * take;
  return plainToInstance(PaginationDto, { skip, take });
}

function getOrder(request: any): OrderDto[] {
  const { order } = request.query;
  if (!order) return [];
  const data = JSON.parse(order);
  return data.map((item) => plainToInstance(OrderDto, camelToKebabValue(item, ['sort'])));
}

function splitQuery(query: any, splitKey: string) {
  const result = {};
  Object.entries(query).forEach(([key, value]) => {
    if (!key.startsWith(splitKey)) return;
    key = key.replace(splitKey, '');
    result[key] = value;
  });
  return result;
}
