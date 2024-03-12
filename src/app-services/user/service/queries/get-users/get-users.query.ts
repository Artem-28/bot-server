import { QueryOptionsDto } from '@app-services/common/dto';

export class GetUsersQuery {
  constructor(public readonly options?: QueryOptionsDto) {}
}
