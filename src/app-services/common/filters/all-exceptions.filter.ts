import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';

@Catch()
export class AllExceptionsFilter<T> implements ExceptionFilter {
  private readonly _logger = new Logger(AllExceptionsFilter.name);
  catch(exception: T, host: ArgumentsHost) {
    this._logger.error(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = this._getStatus(exception);

    const responseError = this._response(status, request, exception);
    response.status(status).json(responseError);
  }

  private _getStatus<T>(exception: T) {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private _response<T>(status: number, request: Request, exception: T) {
    return {
      statusCode: status,
      timestamp: new Date(),
      path: request?.url,
      methods: request?.method,
      params: request?.params,
      query: request?.query,
      exception: {
        name: exception['name'],
        message: exception['message'],
      },
    };
  }
}
