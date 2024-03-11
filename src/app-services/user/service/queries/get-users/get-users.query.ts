import { PaginationDto } from '@app-services/common/dto';

export class GetUsersQuery {
  constructor(public readonly pagination?: PaginationDto) {}
}
