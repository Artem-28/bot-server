import { ExecutionContext } from '@nestjs/common';

export class SuccessResponse<T> {
  public success: boolean = true;
  public statusCode: number;
  public data: T | T[];
  constructor(data: T | T[], ctx: ExecutionContext) {
    const response = ctx.switchToHttp().getResponse();
    this.data = data;
    this.statusCode = response.statusCode;
  }
}
