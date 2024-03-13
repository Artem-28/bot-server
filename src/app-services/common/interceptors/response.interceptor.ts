import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import {
  SuccessResponse,
  ResponseFactory,
} from '@app-services/common/response';

export class ResponseInterceptor<T>
  implements NestInterceptor<T, SuccessResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<SuccessResponse<T>> | Promise<Observable<SuccessResponse<T>>> {
    return next
      .handle()
      .pipe<SuccessResponse<T>>(
        map((data) => ResponseFactory.create(data, context)),
      );
  }
}
