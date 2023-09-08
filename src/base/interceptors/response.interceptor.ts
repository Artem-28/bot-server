import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

interface ISuccessResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
}

export class ResponseInterceptor<T>
  implements NestInterceptor<T, ISuccessResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ):
    | Observable<ISuccessResponse<T>>
    | Promise<Observable<ISuccessResponse<T>>> {
    const success = true;
    const statusCode = context.switchToHttp().getResponse().statusCode;
    return next.handle().pipe(map((data) => ({ success, statusCode, data })));
  }
}
