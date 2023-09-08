import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ExceptionTypeEnum } from '../enum/exception/exception-type.enum';

export interface IHttpExceptionResponse {
  message?: string;
  type?: ExceptionTypeEnum;
}

export interface IErrorResponse {
  success: boolean;
  statusCode: number;
  error: {
    message: string;
    type: ExceptionTypeEnum;
  };
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const errorMessage = getExceptionMessage(exception);
    const errorType = getExceptionType(exception);
    const statusCode = getExceptionStatus(exception);

    const responseData: IErrorResponse = {
      success: false,
      statusCode,
      error: {
        message: errorMessage,
        type: errorType,
      },
    };

    response.status(status).json(responseData);
  }
}

function getExceptionMessage(exception: any): string {
  if (!(exception instanceof HttpException)) {
    return 'error.app.base';
  }
  const response = exception.getResponse() as string | IHttpExceptionResponse;

  if (typeof response === 'string') {
    return response;
  }
  if (response.hasOwnProperty('message')) {
    return response.message;
  }

  return 'error.app.base';
}

function getExceptionType(exception: any): ExceptionTypeEnum {
  if (!(exception instanceof HttpException)) {
    return ExceptionTypeEnum.TYPE_GLOBAL;
  }
  const response = exception.getResponse() as string | IHttpExceptionResponse;

  if (typeof response === 'string') {
    return ExceptionTypeEnum.TYPE_GLOBAL;
  }
  if (response.hasOwnProperty('type') && typeof response.type) {
    return response.type;
  }
  return ExceptionTypeEnum.TYPE_GLOBAL;
}

function getExceptionStatus(exception: any): number {
  if (exception instanceof HttpException) {
    return exception.getStatus();
  }
  return HttpStatus.INTERNAL_SERVER_ERROR;
}
