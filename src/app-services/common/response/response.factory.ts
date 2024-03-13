import { ResponseWithCount } from '@app-services';
import { SuccessPaginationResponse } from '@app-services/common/response/success-pagination.response';
import { SuccessResponse } from '@app-services/common/response/success.response';
import { ExecutionContext } from '@nestjs/common';

export class ResponseFactory {
  static create<T>(data: ResponseWithCount<T>, ctx: ExecutionContext) {
    if ('data' in data && 'count' in data) {
      return new SuccessPaginationResponse(data, ctx);
    }
    return new SuccessResponse(data, ctx);
  }
}
