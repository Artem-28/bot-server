import { SuccessResponse } from '@app-services/common/response';
import { ResponseWithCount } from '@app-services';
import { ExecutionContext } from '@nestjs/common';

export class SuccessPaginationResponse<T> extends SuccessResponse<T> {
  public pagination: {
    total: number;
    limit: number;
    totalPage: number;
    currentPage: number;
  };
  constructor(data: ResponseWithCount<T>, ctx: ExecutionContext) {
    super(data.data, ctx);
    const request = ctx.switchToHttp().getRequest();
    const currentPage = Number(request.query.page || 1) || 1;
    const limit = Number(request.query.limit || 0);
    const total = data.count;
    const totalPage = Math.ceil(total / limit) | 1;
    this.pagination = { total, limit, totalPage, currentPage };
  }
}
