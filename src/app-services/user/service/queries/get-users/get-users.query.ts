import { QueryBuilderOptionsDto } from '@app-services/common/dto';

export class GetUsersQuery {
  constructor(public readonly options?: QueryBuilderOptionsDto) {}
}
