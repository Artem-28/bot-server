import { Type } from '@nestjs/common';
import { IQueryHandler } from '@nestjs/cqrs';
import { GetUserQueryHandler } from '@app-services/user/service/queries/get-user/get-user.query-handler';
import { GetUsersQueryHandler } from '@app-services/user/service/queries/get-users/get-users.query-handler';

export const USER_QUERY_HANDLERS: Type<IQueryHandler>[] = [
  GetUserQueryHandler as Type<IQueryHandler>,
  GetUsersQueryHandler as Type<IQueryHandler>,
];
