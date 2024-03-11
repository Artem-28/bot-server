import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PaginationDto } from '@app-services/common/dto';

export const QueryOptions = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const pagination = getPagination(request);
    return { pagination };
  },
);

function getPagination(request: any) {
  const { page, limit } = request.query;
  const pageNum = Number(page) || 1;
  const take = Number(limit) || 0;
  const skip = (pageNum - 1) * take;
  return plainToInstance(PaginationDto, { skip, take });
}
